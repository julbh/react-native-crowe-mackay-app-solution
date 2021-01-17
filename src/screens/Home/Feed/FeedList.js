import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView, Linking, Alert, RefreshControl, View, Dimensions,
} from 'react-native';
import {getFeedAction, setFeedAction} from '../../../redux/actions/feedAction';
import * as Actions from '../../../redux/actions';
import {bindActionCreators} from 'redux';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Card, ListItem, Avatar, Button, Icon, Overlay, Input, Image, Badge} from 'react-native-elements';
import {ActivityIndicator, FAB, TextInput} from 'react-native-paper';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutoHeightImage from 'react-native-auto-height-image';
import Markdown from 'react-native-markdown-renderer';
import Toast from 'react-native-simple-toast';
import jwtDecode from 'jwt-decode';
import human from 'human-time';
import LoadingScreen from './components/LoadingScreen';
import {
    createShortCode,
    DATA,
    getUsersByIds,
    parseMedia,
    timeToSeconds,
    toHumanTime,
    uriToBlob,
} from '../../../services/common';
import {getFeedService, uploadFeedImage, uploadFeedService} from '../../../services/feed';
import noImage from '../../../assets/images/no-image.jpg';
import noAvatar from '../../../assets/images/no_avatar.png';
import selectImage from '../../../assets/images/selectImage.png';
import loadingImage from '../../../assets/images/loading.gif';
import {pusher} from '../../../../App';
import {CHAT_EVENT, SUBSCRIBE_TO_CHANNEL} from '../../../config';
import {getChatHistoryService, updateHistoryService} from '../../../services/feed/chatService';
import {GET_CHAT_HISTORY_ERR, GET_CHAT_HISTORY_REQ, GET_CHAT_HISTORY_SUC} from '../../../redux/constants/chatConstants';
import {useAppSettingsState} from '../../../context/AppSettingsContext';

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

function FeedList(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const chatHistoryData = useSelector(({chatHistoryData}) => chatHistoryData);
    const chatUsersReducer = useSelector((rootReducer) => rootReducer.chatUsersReducer);

    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [loadingImg, setLoaingImage] = useState(false);
    const [loading, setLoaing] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [cardWidth, setCardWidth] = React.useState(0);
    const userData = useSelector((rootReducer) => rootReducer.userData);
    const [loadmore, setLoadmore] = useState(false);
    const [pagination, setPagination] = useState(1);
    const [loadmoreEnd, setLoadmoreEnd] = useState(false);

    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        let {user_id} = auth_strategy ? '' : (jwtDecode(userData.id_token));
        props.getFeed({page: 1, user_id});
        setPagination(1);
        setLoadmoreEnd(false);
        props.getChatHistory(user_id);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    // get feed
    useEffect(() => {
        let {user_id} = auth_strategy ? '' : (jwtDecode(userData.id_token));
        props.getFeed({page: pagination, user_id});
    }, []);

    // every message received.
    const updateHistory = (data, chatHistory) => {
        let user = auth_strategy ? {} : (jwtDecode(userData.id_token));
        let tmp = chatHistory.filter(o => o.data.channel_payload.channel === data.channel);
        let currentHistory = tmp[0];
        let _id = currentHistory._id;
        let curData = currentHistory.data;
        let unread = (curData.channel_payload.unread === undefined ? 0 : curData.channel_payload.unread);
        let newData = {
            ...curData,
            channel_payload: {
                ...curData.channel_payload,
                last_message: data.text,
                last_time: data.composedAt,
                last_sender: data.user,
                read: true,
                // unread: user.user_id !== data.user._id ? 0 : unread + 1,
                // unread: user.user_id === data.user._id ? 0 : unread + 1,
            },
        };
        updateHistoryService(_id, newData).then(res => {
            dispatch(Actions.getChatHistoryAction(user.user_id));
        }).catch(err => {
        });
    };

    // get chat history
    useEffect(() => {
        dispatch({type: GET_CHAT_HISTORY_REQ});
        let {user_id} = auth_strategy ? {} : (jwtDecode(userData.id_token));
        let data = {
            event: CHAT_EVENT,
            channel: SUBSCRIBE_TO_CHANNEL,
            user_id,
        };
        getChatHistoryService(data).then(chatHistory => {
            dispatch({type: GET_CHAT_HISTORY_SUC, data: chatHistory});
            chatHistory.map(h => {
                let chatChannel = pusher.subscribe(h.data.channel_payload.channel);
                chatChannel.bind(CHAT_EVENT, (data) => {
                    console.log('receive message ===> ', data);
                    let messageData = {
                        ...data,
                        createdAt: new Date(data.composedAt),
                    };
                    if (data.type !== SUBSCRIBE_TO_CHANNEL) {
                        dispatch(Actions.appendChatMessageAction(messageData));
                        updateHistory(data, chatHistory);
                    }
                });
            });
            subscribeNewChat();
        }).catch(err => {
            dispatch({type: GET_CHAT_HISTORY_ERR});
        });
    }, []);

    const subscribeNewChat = () => {
        let id_token = userData.id_token;
        let curUser = (jwtDecode(id_token));
        let subscribe_channel = pusher.subscribe(SUBSCRIBE_TO_CHANNEL);
        subscribe_channel.bind(CHAT_EVENT, (data) => {
            console.log('invited new chat ======> ', data);
            if (data.type === SUBSCRIBE_TO_CHANNEL && data._user_ids.includes(curUser.user_id)) {

                let payloadData = {
                    event: CHAT_EVENT,
                    channel: SUBSCRIBE_TO_CHANNEL,
                    user_id: curUser.user_id,
                };
                getChatHistoryService(payloadData).then(chatHistory => {
                    dispatch({type: GET_CHAT_HISTORY_SUC, data: chatHistory});
                    // updateHistory(data.text, data.composedAt, data.user, data.channel, chatHistory);

                    let chatChannel = pusher.subscribe(data.channel);
                    chatChannel.bind(CHAT_EVENT, (data) => {
                        let messageData = {
                            ...data,
                            createdAt: new Date(data.composedAt),
                        };
                        if (data.type !== SUBSCRIBE_TO_CHANNEL) {
                            dispatch(Actions.appendChatMessageAction(messageData));
                            updateHistory(data, chatHistory);
                        }
                    });
                }).catch(() => {
                });
            }
        });
    };

    useEffect(() => {
        ref.current = true;
        let {params} = props.route;
        if (!props.feedData.loading && props.feedData.feed && params !== undefined) {
            let id = params.id;
            if (params.type === undefined) {
                props.feedData.feed.filter(item => item._id === id).forEach(item => {
                    if (item && ref.current) {
                        // let medias = parseMedia(item.data.media);  // Old type
                        let medias = parseMedia(item.media);
                        // props.navigation.navigate('Feed', {screen: 'FeedDetails', params: item});
                        props.navigation.navigate('DetailsNav', {screen: 'FeedDetails', params: {...item, medias}});
                    }
                });
            } else if (!chatHistoryData.loading && chatHistoryData.data !== undefined && chatHistoryData.data?.length > 0 && params.type === 'chat') {
                let _user_ids = id.split('@');
                _user_ids.splice(0, 1);
                getUsersByIds(_user_ids).then((users) => {
                    let tmpUsers = [];
                    users.map(user => {
                        let tmp = {
                            _id: user._id,
                            full_name: user.data.full_name,
                            picture: user.data.picture,
                            email: user.data.email,
                            position: user.data.position,
                        };
                        tmpUsers.push(tmp);
                    });
                    dispatch(Actions.setChatUsersAction(tmpUsers));
                    props.navigation.navigate('ChatNav', {
                        screen: 'ChatBox',
                        params: {item: {channel: id, _user_ids}},
                    });
                    props.navigation.setParams({id: null, type: null});
                }).catch(e => {
                });
            }
        }
        return () => {
            ref.current = false;
        };
    }, [chatHistoryData, props.feedData]);

    const toggleOverlay = () => {
        setLoaingImage(false);
        setImage(null);
        setVisible(!visible);
    };

    const onLayoutImage = (e) => {
        const width = e.nativeEvent.layout.width;
        setCardWidth(width);
    };

    const uploadImage = () => {
        const options = {
            title: 'Select Feed Image',
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                // path: 'images',
            },
        };

        ImagePicker.openPicker({
            width: 300,
            height: 400,
            //includeBase64: true,
            cropping: true,
        }).then(response => {

            // let uri = response.path;
            let uri = response.sourceURL;
            let mime = response.mime;
            // let uri = response.sourceURL.replace('file://', '');

            // let uri = `data:${response.mime};base64,` + response.data;
            // console.log(uri,response.sourceURL);
            // setImage(uri);

            setLoaingImage(true);
            uriToBlob(uri, mime).then(res => {
                console.log('**********************', res);
                let type = response.mime;
                let fileExtension = response.filename.split('.').reverse()[0];
                let fileId = createShortCode();
                let filenameRandom = fileId + '.' + fileExtension;
                let data = {
                    'Bucket': 'assets.tcog.hk',
                    'Expires': 8640000,
                    'Key': filenameRandom,
                    'ContentType': mime,
                    'ACL': 'public-read',
                };
                uploadFeedImage(data, res, response).then(res => {
                    console.log('upload success!!!!!!!!!', res);
                    setLoaingImage(false);
                    setImage(res);
                }).catch(err => {
                    console.log('upload failed', err);
                    setLoaingImage(false);
                    Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                });
            }).catch(err => {
                console.log('uri To Blob error', err);
                setLoaingImage(false);
                Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            });
        }).catch(err => {
            console.log('image picker error', err);
        });
    };

    const uploadFeed = () => {
        let curFeeds = [...props.feedData.feed];
        let user_id = '';
        if (image === null) {
            Alert.alert('Please wait while the image is uploading!');
            return;
        }
        setLoaing(true);
        AsyncStorage.getItem('id_token')
            .then((response) => {
                user_id = (jwtDecode(response)).user_id;
                let data = {
                    user_id: user_id,
                    content: content,
                    media: [
                        image,
                    ],
                };
                uploadFeedService(data).then(res => {
                    let newFeeds = [res, ...curFeeds];
                    // curFeeds.push(res);
                    props.setFeed(newFeeds);
                    setLoaing(false);
                    setImage(null);
                    setContent('');
                    Toast.showWithGravity('You have uploaded a new feed successfully!', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                    setVisible(false);
                }).catch(err => {
                    setLoaing(false);
                    setImage(null);
                    setContent('');
                    Toast.showWithGravity('Uploading a new feed failed!', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                });
            })
            .catch(err => {
                setLoaing(false);
                setImage(null);
                setContent('');
                Toast.showWithGravity('Uploading a new feed failed!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            });
    };

    const openUserProfile = (user) => {
        if (Boolean(user?.user_id)) {
            props.navigation.navigate({name: 'UserProfile', params: {user}});
        } else {
            props.navigation.navigate({name: 'FeedWebview', params: {query: user?.profile, title: 'User Profile'}});
        }
    };

    const openFeedDetails = (item, medias) => {
        if (Boolean(item?.web_url)) {
            props.navigation.navigate({name: 'FeedWebview', params: {query: item?.web_url, title: 'Feed Details'}});
        } else {
            props.navigation.navigate('DetailsNav', {
                screen: 'FeedDetails',
                // params: item,
                params: {...item, medias},
            });
        }
    };

    const _handleLoadmore = () => {
        if (!loadmoreEnd) {
            setLoadmore(true);
            let {user_id} = auth_strategy ? '' : (jwtDecode(userData.id_token));
            getFeedService({page: pagination + 1, user_id}).then(res => {
                setPagination(pagination + 1);
                // props.setFeed([...res.allFeeds]);
                props.setFeed([...props.feedData.feed, ...res.allFeeds]);
                setLoadmoreEnd(!res.loadmore);
                setLoadmore(false);
            }).catch(err => {
                console.log('error ==> ', err);
                setLoadmoreEnd(true);
                setLoadmore(false);
            });
        }
    };

    const onComments = (item) => {
        console.log('on comments')
        props.navigation.navigate('FeedComments')
    };

    const onLike = (item) => {

    };

    const renderLoading = ({item}) => (
        <LoadingScreen/>
    );

    const renderItem = ({item}) => {
        // let medias = parseMedia(item.data.media);
        let medias = parseMedia(item.media);
        // console.log('************ medias ', medias, item.data.media)

        return (
            <Card containerStyle={{borderRadius: 8, marginBottom: -6}}>
                <TouchableOpacity onPress={() => openUserProfile(item.user)}>
                    <ListItem bottomDivider>
                        <Avatar rounded
                                source={item.user.picture === undefined || '' ? noAvatar : {uri: item.user?.picture}}/>
                        {/*source={item.userInfo.data.picture === undefined || '' ? noAvatar : {uri: item.userInfo.data.picture}}/>*/}
                        <ListItem.Content>
                            <ListItem.Title style={styles.titleStyle}>{item.user?.full_name}</ListItem.Title>
                            {/*<TouchableOpacity onPress={() => Linking.openURL(item.userInfo.data.data.profile)}>*/}
                            <ListItem.Subtitle
                                style={styles.profileLink}>{item.user?.bio}</ListItem.Subtitle>
                            {/*</TouchableOpacity>*/}
                        </ListItem.Content>
                    </ListItem>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        openFeedDetails(item, medias)
                    }>
                    {
                        medias.videos.length === 0 ?
                            <>
                                <View onLayout={onLayoutImage}>
                                    {item.media.length > 0 && item.media[0] !== '' && <AutoHeightImage
                                        width={cardWidth}
                                        source={item.media[0] === undefined || '' ? noImage : {uri: item.media[0]}}
                                        // fallbackSource={image}
                                    />}
                                </View>
                                {item.media.length > 1 &&
                                <Badge
                                    containerStyle={{position: 'absolute', top: 4, right: 4}}
                                    badgeStyle={{backgroundColor: '#00000055'}}
                                    value={`1/${item.media.length}`}
                                />}
                            </>
                            :
                            <View>
                                <View onLayout={onLayoutImage}
                                >
                                    <AutoHeightImage
                                        width={cardWidth}
                                        source={medias.images[0] === undefined || '' ? noImage : {uri: medias.images[0]}}
                                        // fallbackSource={image}
                                    />
                                </View>
                                <View style={styles.overlayIcon}>
                                    <Icon
                                        // raised
                                        // name='play-circle-o'
                                        // type='font-awesome'
                                        name='play-box'
                                        type='material-community'
                                        color={globalStyle?.gray_tone_3}
                                        size={80}
                                    />
                                </View>
                            </View>
                        /*<View onLayout={onLayoutImage}>
                            {item.data.media.length > 0 && item.data.media[0] !== '' && <AutoHeightImage
                                width={cardWidth}
                                source={{uri: medias.images[0]}}
                                // fallbackSource={image}
                            />}
                        </View>*/
                    }
                    {/*<View style={styles.actionContainer}>
                        <TouchableOpacity
                            onPress={() => onLike(item)}
                        >
                            <Icon
                                // raised
                                // name='play-circle-o'
                                // type='font-awesome'
                                name='heart'
                                type='font-awesome'
                                color={globalStyle?.primary_color_2}
                                size={20}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onComments(item)}
                            style={{marginLeft: 10}}
                        >
                            <Icon
                                // raised
                                // name='play-circle-o'
                                // type='font-awesome'
                                name='comment-o'
                                type='font-awesome'
                                color={globalStyle?.primary_color_2}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>*/}
                    <Markdown>{item?.content}</Markdown>
                    {/*<Card.Title style={styles.contentStyle}>
                        {item.data.content}
                    </Card.Title>*/}
                    <Card.Title style={styles.timeStyle}>
                        {toHumanTime(item.updatedAt)}
                    </Card.Title>
                </TouchableOpacity>

            </Card>
        );
    };

    const _renderFooter = () => {
        if (!loadmore) {
            return null;
        }

        return (
            <View
                style={{
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    // height: 50,
                    // margin: 20,
                    // borderColor: colors.veryLightPink
                }}
            >
                <ActivityIndicator style={{marginTop: 15}} animating size="small"/>
            </View>
        );
    };

    if (props.feedData.loading || props.chatHistoryData.loading && props.chatHistoryData?.data?.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={DATA}
                    renderItem={renderLoading}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View></View>
            <FlatList
                data={props.feedData.feed}
                renderItem={renderItem}
                // keyExtractor={item => item._id}
                keyExtractor={item => item.content}
                onRefresh={onRefresh}
                refreshing={refreshing}
                contentContainerStyle={{paddingBottom: loadmore ? 50 : 20}}
                ListFooterComponent={_renderFooter}
                onEndReached={_handleLoadmore}
                onEndReachedThreshold={0.5}
            />
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={styles.overlay}
            >
                <ScrollView style={styles.inputContainer}>
                    <TouchableOpacity onPress={uploadImage}>
                        <Image
                            style={styles.image}
                            source={loadingImg ? loadingImage : image ? {uri: image} : selectImage}
                            PlaceholderContent={<ActivityIndicator/>}
                        />
                    </TouchableOpacity>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        mode={'outlined'}
                        label="Content"
                        placeholder="Please write the content"
                        leftIcon={{type: 'font-awesome', name: 'id-card'}}
                        value={content}
                        style={{marginTop: 20}}
                        onChangeText={value => setContent(value)}
                    />
                    <Button
                        icon={
                            <Icon
                                type={'font-awesome'}
                                name="upload"
                                size={16}
                                color="white"
                                containerStyle={{padding: 5}}
                            />
                        }
                        title="Upload"
                        containerStyle={{width: '100%', marginTop: 20}}
                        buttonStyle={{backgroundColor: globalStyle?.primary_color_2}}
                        onPress={uploadFeed}
                        loading={loading}
                    />
                </ScrollView>
            </Overlay>
            {/*<FAB
                style={{...styles.fab, backgroundColor: globalStyle?.primary_color_2}}
                color={'white'}
                small={false}
                animated
                icon={'plus'}
                onPress={toggleOverlay}
            />*/}
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        item: {
            backgroundColor: '#f9c2ff',
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
        },
        title: {
            fontSize: 32,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        },
        overlay: {
            width: '80%',
            padding: 10,
        },
        inputContainer: {
            padding: 12,
        },
        image: {
            width: '100%',
            height: 180,
            resizeMode: 'cover',
        },
        contentStyle: {
            marginTop: 10,
            textAlign: 'left',
            fontWeight: '200',
            fontSize: 14,
        },
        profileLink: {
            // textDecorationLine: 'underline',
            // fontStyle: 'italic',
        },
        titleStyle: {
            fontWeight: 'bold',
        },
        timeStyle: {
            fontSize: 12,
            textAlign: 'left',
            fontWeight: '200',
        },
        overlayIcon: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        actionContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingVertical: 10,
        },
    });
};

const mapStateToProps = state => ({
    feedData: state.feedData,
    chatHistoryData: state.chatHistoryData,
    userData: state.userData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getFeed: getFeedAction,
    setFeed: setFeedAction,
    getChatHistory: (user_id) => Actions.getChatHistoryAction(user_id),
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedList);
