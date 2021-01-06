import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView, FlatList, Alert,
} from 'react-native';
import {Avatar, Button, Icon, Accessory, ListItem, Card, SearchBar} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../../../redux/actions';
import {createShortCode, DATA, uriToBlob} from '../../../services/common';
import noAvatar from '../../../assets/images/no_avatar.png';
import LoadingScreen from './components/LoadingScreen';
import {deleteInboxService, updateInboxService} from '../../../services/inbox';
import human from 'human-time';
import Markdown from 'react-native-markdown-renderer';
import URI from 'urijs';
import {SwipeListView} from 'react-native-swipe-list-view';
import {getCommentByIdService} from '../../../services/microApps';
import {useAppSettingsState} from "../../../context/AppSettingsContext";

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

const InboxScreen = (props) => {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    let dispatch = useDispatch();
    let userData = useSelector((rootReducer) => rootReducer.userData);
    let inboxData = useSelector((rootReducer) => rootReducer.inboxData);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // props.getFeed();
        dispatch(Actions.getInboxAction());
        // props.getInbox();
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const changeStatus = (status, item) => {
        let {_id} = item;
        let updatedInbox = [];
        for (let inbox of inboxData.data) {
            let tmp = {...inbox};
            if (inbox._id === _id) {
                tmp.data.status = status;
            }
            updatedInbox.push(tmp);
        }
        dispatch(Actions.setInboxAction(updatedInbox));
        updateInboxService({status, _id}).then(res => {
        }).catch(err => {
            console.log('error ===> ', err);
        });

        let deeplink = item?.data?.deeplink;
        console.log('deeplink url ===> ', deeplink, Boolean(deeplink));
        if (Boolean(deeplink)) {

            let uri = URI(deeplink);
            let query = uri.query(true)?.url;
            let app_type = uri.segment(0);
            let app_id = uri.segment(1);

            /*let linkseg = deeplink.split('/');
            let app_type = linkseg[0];
            let app_id = linkseg[1];*/
            if (app_type === 'microapps') {
                console.log('microapps', app_id);
                props.navigation.navigate('MicroAppNav', {
                    screen: 'MicroApp',
                    // params: {app_id: '5f87560529fc3900087758bd'},
                    params: {app_id},
                });
            } else if (app_type === 'webview') {
                props.navigation.navigate('WebViewScreen', {
                    query,
                });
            } else if (app_type === 'comment') {
                getCommentByIdService(app_id).then(res => {
                    console.log('res ===> ', res);
                    props.navigation.navigate('MicroAppNav', {
                        screen: 'DatabaseNav',
                        params: {
                            screen: 'Comments',
                            params: {
                                type: 'deeplink',
                                comment: res.data, // {reference_id, comment_id, content}
                            },
                        },
                    });
                }).catch(err => {
                    console.log('navigate deeplink error ===> ', err);
                });
            }
        }
    };

    const renderLoading = () => <LoadingScreen/>;

    // if (!inboxData.length || refreshing) {
    if (refreshing || inboxData.loading) {
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

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, item) => {

        console.log(rowMap, item);
        Alert.alert(
            'Please confirm!',
            'Are you sure delete this item?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => onOK()},
            ],
            {cancelable: false},
        );

        const onOK = () => {
            closeRow(rowMap, item._id);

            deleteInboxService(item).then(res => {
                const newData = [...inboxData.data];
                const prevIndex = inboxData.data.findIndex(it => it._id === item._id);
                newData.splice(prevIndex, 1);
                dispatch(Actions.setInboxAction(newData));
            }).catch(e => {

            });
        };
    };

    const hideRow = (rowMap, item) => {
        closeRow(rowMap, item._id);
        const newData = [...inboxData.data];
        const prevIndex = inboxData.data.findIndex(it => it._id === item._id);
        newData.splice(prevIndex, 1);
        dispatch(Actions.setInboxAction(newData));
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                onPress={() => hideRow(rowMap, data.item)}
            >
                <Icon name="eye-slash" type="font-awesome-5"/>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item)}
            >
                <Icon name="trash-alt" type="font-awesome-5"/>
            </TouchableOpacity>
        </View>
    );

    const renderItem = (data, rowMap) => {
        let {item} = data;
        return (
            <TouchableOpacity onPress={() => changeStatus('READ', item)}>
                <ListItem
                    // bottomDivider
                    containerStyle={item.data.status === 'READ' ? styles.expiredCardContainer : styles.cardItemContainer}
                >
                    <Avatar rounded
                            source={item.authorInfo.data.picture === undefined || '' ? noAvatar : {uri: item.authorInfo.data.picture}}
                            size={'medium'}/>
                    <ListItem.Content>
                        <Markdown>{item.data.description}</Markdown>
                        <Text style={styles.timeStyle}>
                            {human((Date.now() - (new Date(item.createdAt)).getTime()) / 1000)}
                        </Text>
                    </ListItem.Content>
                    {Boolean(item?.data.deeplink) && <ListItem.Chevron/>}
                </ListItem>

            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View></View>
            <SwipeListView
                data={inboxData.data.filter(inbox => inbox.data.status !== 'HIDDEN')}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
                keyExtractor={item => item._id}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
            {/*<FlatList
                data={inboxData.data.filter(inbox => inbox.data.status !== 'HIDDEN')}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                onRefresh={onRefresh}
                refreshing={refreshing}
                contentContainerStyle={{paddingBottom: 20}}
            />*/}
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
        actionArea: {
            // flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            padding: 5,
        },
        actionContainer: {
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        cardItemContainer: {
            // marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 2,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
        },
        expiredCardContainer: {
            shadowColor: '#000',
            shadowOffset: {
                width: 7,
                height: 7,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 5,
            backgroundColor: '#f0f0f0',
            // marginBottom: 20,
        },
        timeStyle: {
            // marginTop: -10,
            fontSize: 12,
            textAlign: 'left',
            fontWeight: '200',
            color: globalStyle.gray_tone_1,
        },

        backTextWhite: {
            color: '#FFF',
        },
        rowBack: {
            alignItems: 'center',
            // backgroundColor: '#ddd',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 15,
            marginBottom: 1,
            // marginVertical: 10,
        },
        backRightBtn: {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: 75,
        },
        backRightBtnLeft: {
            backgroundColor: 'blue',
            right: 75,
        },
        backRightBtnRight: {
            // backgroundColor: 'red',
            right: 0,
        },
    })
};

export default InboxScreen;
/*

const mapStateToProps = state => ({
    // feedData: state.feedData,
    profileData: state.profileData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getFeed: getFeedAction,
    setFeed: setFeedAction,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfileScreen);
*/
