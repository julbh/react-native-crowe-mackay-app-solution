import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    SafeAreaView, FlatList, View,
} from 'react-native';
import {Avatar, Button, Icon, Accessory, ListItem, Card, SearchBar} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import noAvatar from '../../../../../assets/images/no_avatar.png';
import {DATA, makeImageUri, timeToSeconds, toHumanTime} from '../../../../../services/common';
import LoadingScreen from '../../components/LoadingScreen';
import {getAllUsersService, getListClassService} from '../../../../../services/microApps';
import {imageSize} from '../../../../../config';
import jwtDecode from 'jwt-decode';
import {useAppSettingsState} from '../../../../../context/AppSettingsContext';
import {ActivityIndicator} from 'react-native-paper';
import {getFeedService} from '../../../../../services/feed';
import * as Actions from '../../../../../redux/actions';
import TrackPlayer from 'react-native-track-player';


const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

const ListClass = (props) => {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    let dispatch = useDispatch();
    let userData = useSelector((rootReducer) => rootReducer.userData);
    let inboxData = useSelector((rootReducer) => rootReducer.inboxData);

    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [payload, setPayload] = useState({});
    const [listData, setListData] = useState([]);
    const [endLoadmore, setEndLoadmore] = useState(false);
    const [loadmore, setLoadmore] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const [currentUser, setUser] = useState({});

    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getList(payload, searchText, 1);
        setPage(1);
        setEndLoadmore(false);
    }, []);

    const getList = (payload, search, pagination) => {
        setLoading(true);
        getListClassService(payload, search, pagination).then(res => {
            setLoading(false);
            let {data, total_page} = res;
            setListData(data);
            setRefreshing(false);
        }).catch(err => {
            setLoading(false);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            if (props.route?.params) {
                let params = props.route.params;
                setPayload(params?.payload);
                console.log('payload ==> ', params?.payload)
                getList(params?.payload, searchText, 1);
            }
        });
        return () => unsubscribe();
    }, []);

    const _handleLoadmore = () => {
        if (!endLoadmore && !Boolean(searchText)) {
            setLoadmore(true);
            getListClassService(payload, searchText, page + 1).then(res => {
                setLoadmore(false);
                setPage(page + 1);
                let {data, total_page} = res;
                if (page + 1 > total_page) {
                    setEndLoadmore(true);
                }
                setListData([...listData, ...data]);
            }).catch(err => {
                setLoadmore(false);
            });
            // let {user_id} = auth_strategy ? '' : (jwtDecode(userData.id_token));
        }
    };

    const delayedQuery = useCallback(
        _.debounce((q, payload) => {
            console.log(`Querying for ${q}`, payload);
            getList(payload, q, 1);
            setPage(1);
            setEndLoadmore(false);
        }, 500),
        [],
    );
    const handleSearchText = (text) => {
        setSearchText(text);
        delayedQuery(text, payload);
    };

    /*const formatPlayList = (item) => {
        let formattedList = [];
        let tmp = {
            id: item.id,
            url: payload?.display_mode === 'MP3' ? item.mp3 : item.mp4,
            title: item.title,
            artist: '',
            description: '',
            artwork: item.img,
            web_links: '',
        };
        formattedList.push(tmp);
        dispatch(Actions.setFormattedListAction(formattedList));
    };

    const startPlay = (item) => {
        formatPlayList(item);
        dispatch(Actions.setPlayModeAction('LIST'));
        dispatch(Actions.setDialogTypeAction(payload.display_mode, item.id));
        dispatch(Actions.setDialogStateAction(0));
    };*/

    const handleClickItem = async (item) => {
        console.log('item ==> ', item, payload);
        props.navigation.navigate('ListClassDetails', {item});
        /*if (payload?.display_mode === 'WEB') {
            props.navigation.navigate('WebDetails', {landing_url: item.url});
        } else if (payload?.display_mode === 'MP3') {
            await TrackPlayer.reset();
            startPlay(item);
        } else if (payload?.display_mode === 'MP4') {
            startPlay(item);
        }*/
    };

    const renderLoading = () => <LoadingScreen rounded={false}/>;

    if (loading || refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={handleSearchText}
                    // onChange={onChange}
                    value={searchText}
                    round={true}
                    inputContainerStyle={{backgroundColor: 'white'}}
                />
                <FlatList
                    data={DATA}
                    renderItem={renderLoading}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            </SafeAreaView>

        );
    }

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
                }}
            >
                <ActivityIndicator style={{margin: 15}} animating size="small"/>
            </View>
        );
    };


    function renderItem({item}) {
        return (
            <TouchableOpacity onPress={() => handleClickItem(item)}>
                <ListItem
                    bottomDivider
                >
                    <Avatar
                        rounded={false}
                        source={Boolean(item?.img) ?
                            {uri: item.img} : noAvatar}
                        size={imageSize.normal}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{item.title}</ListItem.Title>
                        <ListItem.Subtitle style={{color: globalStyle?.gray_tone_2}}>{toHumanTime(item.date)}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={handleSearchText}
                value={searchText}
                round={true}
                inputContainerStyle={{backgroundColor: 'white'}}
            />
            <FlatList
                removeClippedSubviews={true}
                initialNumToRender={5}
                data={listData}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                onRefresh={onRefresh}
                refreshing={refreshing}
                contentContainerStyle={{paddingBottom: 20}}
                ListFooterComponent={_renderFooter}
                onEndReached={_handleLoadmore}
                onEndReachedThreshold={0.5}
            />
        </SafeAreaView>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            flex: 1,
            backgroundColor: 'white',
        },
        titleStyle: {
            // fontWeight: 'bold',
            fontSize: 13,
        },
        emailStyle: {
            fontWeight: '900',
        },
    });
};

export default ListClass;
