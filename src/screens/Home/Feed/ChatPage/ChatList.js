import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Badge, ListItem } from 'react-native-elements';
import jwtDecode from 'jwt-decode';
import human from 'human-time';
import noAvatar from '../../../../assets/images/no_avatar.png';
import * as Actions from '../../../../redux/actions';
// import { globalStyle } from '../../../../assets/style';
import { imageSize } from '../../../../config';
import { updateHistoryService } from '../../../../services/feed/chatService';
import { baseStyles } from '../../../../assets/style/baseStyles';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

const smallAvatar = imageSize.small;
const normalAvatar = imageSize.normal;

function ChatList(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const chatHistoryData = useSelector(({ chatHistoryData }) => chatHistoryData);
    const chatUsersReducer = useSelector((rootReducer) => rootReducer.chatUsersReducer);
    const userData = useSelector(({ userData }) => userData);
    const [user, setUser] = useState({});

    useEffect(() => {
        let curUser = (jwtDecode(userData.id_token));
        setUser(curUser);
    }, []);
    console.log('chat history === > ', chatHistoryData)

    const combineNames = (users) => {
        let tmp = [];
        users.filter(o => o._id !== user.user_id).map(user => {
            tmp.push(user.full_name);
        });
        return tmp.join(', ');
    };

    const fewItems = (items) => {
        return items.filter(o => o._id !== user.user_id).slice(0, 2);
    };

    const displayCurrentHistory = (payload) => {
        if (payload.last_message === undefined && payload.last_sender === undefined) {
            return '';
        }
        let sender = '';
        let message = '';
        if (payload.last_sender !== undefined) {
            if (payload.last_sender._id === user.user_id) {
                sender = 'You';
            } else {
                sender = payload.last_sender.name;
            }
        }
        if (payload.last_message !== undefined) {
            message = payload.last_message;
        }
        return `${sender}: ${message}`;
    };

    const displayTime = (payload) => {
        if (payload.last_message === undefined && payload.last_sender === undefined) {
            return '';
        }
        let last_time = '';
        if (payload.last_time !== undefined) {
            last_time = human((Date.now() - (new Date(payload.last_time)).getTime()) / 1000);
        }
        return last_time;
    }

    const onClickListItem = (item) => {
        // let users = item.data.payload.users.filter(o => o._id !== user.user_id);
        dispatch(Actions.setChatUsersAction(item.data.channel_payload.users));
        console.log('set chat users ===> ', chatUsersReducer);
        props.navigation.navigate({
            name: 'ChatBox',
            params: { item: { ...item.data.channel_payload, createdAt: item.data.channel_payload.composedAt } },
        });
        let curData = item.data;
        let newData = {
            ...curData,
            channel_payload: {
                ...curData.channel_payload,
                read: {
                    ...curData.channel_payload.read,
                    [user.user_id]: true,
                },
                // unread: user.user_id !== data.user._id ? 0 : unread + 1,
                // unread: user.user_id === data.user._id ? 0 : unread + 1,
            },
        };
        console.log('update read status ==> ', curData, newData);
        updateHistoryService(item._id, newData).then(res => {
            dispatch(Actions.getChatHistoryAction(user.user_id));
        }).catch(err => {
        });
    };

    function renderItem({ item }) {
        if(item.data.channel_payload === undefined) return null;
        let users = item.data.channel_payload.users.filter(o => o._id !== user.user_id);
        let channel_payload = item.data.channel_payload;
        // let users = item.users.filter(o => o._id !== user.user_id);
        return (
            <TouchableOpacity onPress={() => onClickListItem(item)}
                /*onPress={() => {
                    dispatch(Actions.setChatUsersAction(users));
                    props.navigation.navigate({
                        name: 'ChatBox',
                        params: {item: {...item.data.payload, createdAt: item.data.payload.composedAt}},
                    });
                }}*/>
                <ListItem bottomDivider={true}>
                    {users.filter(o => o._id !== user.user_id).length < 3 ?
                        <View style={styles.avatarContainer}>
                            {
                                users.length === 2 ?
                                    <View style={styles.avatars}>
                                        <Avatar
                                            rounded={true}
                                            source={users[0].picture !== undefined && users[0].picture !== '' ?
                                                { uri: users[0].picture } : noAvatar}
                                            size={smallAvatar}
                                            containerStyle={styles.leftAvatar}
                                        />
                                        <Avatar
                                            rounded={true}
                                            source={users[1].picture !== undefined && users[1].picture !== '' ?
                                                { uri: users[1].picture } : noAvatar}
                                            size={smallAvatar}
                                            containerStyle={styles.rightAvatar}
                                        />
                                    </View>
                                    :
                                    <View style={styles.avatars}>
                                        <Avatar
                                            rounded={true}
                                            source={users[0].picture !== undefined && users[0].picture !== '' ?
                                                { uri: users[0].picture } : noAvatar}
                                            size={normalAvatar}
                                        />
                                    </View>
                            }
                        </View>
                        :
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatars}>
                                <Avatar
                                    rounded={true}
                                    source={users[0].picture !== undefined && users[0].picture !== '' ?
                                        { uri: users[0].picture } : noAvatar}
                                    size={smallAvatar}
                                    containerStyle={styles.leftAvatar}
                                />
                                <Avatar
                                    rounded={true}
                                    source={users[1].picture !== undefined && users[1].picture !== '' ?
                                        { uri: users[1].picture } : noAvatar}
                                    size={smallAvatar}
                                    containerStyle={styles.rightAvatar}
                                />
                                <Avatar
                                    rounded
                                    title={`+${users.length - 2}`}
                                    size={smallAvatar}
                                    containerStyle={styles.textAvatar}
                                    titleStyle={{ color: globalStyle?.primary_color_2 }}
                                />
                            </View>
                        </View>
                    }
                    <ListItem.Content>
                        <View style={styles.nameContainer}>
                            <ListItem.Title
                                style={{ fontWeight: 'bold' }}
                                numberOfLines={1}
                                ellipsizeMode='tail'>{combineNames(users)}</ListItem.Title>
                            <ListItem.Subtitle
                                style={{ fontSize: 12 }}
                                numberOfLines={1}
                                ellipsizeMode='tail'>{displayTime(channel_payload)}</ListItem.Subtitle>
                        </View>
                        <ListItem.Subtitle
                            numberOfLines={1}
                            ellipsizeMode='tail'>{displayCurrentHistory(channel_payload)}</ListItem.Subtitle>
                    </ListItem.Content>
                    {Boolean(channel_payload.read) && !Boolean(channel_payload.read[user.user_id]) && <Badge status="error" />}
                </ListItem>
            </TouchableOpacity>
        );
    }


    if (chatHistoryData.data.length === 0) {
        return (
            <View style={baseStyles.centerContainer}>
                <Text style={{ fontSize: 16, color: globalStyle?.primary_color_2 }}>Start a conversation by creating new chat.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                removeClippedSubviews={true}
                initialNumToRender={5}
                data={chatHistoryData.data}
                // data={chatHistoryData.data}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                // keyExtractor={item => item.channel}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        avatarContainer: {
            flexDirection: 'row',
        },
        leftAvatar: {
            top: 0,
            right: 0,
            position: 'absolute',
            borderColor: 'white',
            borderWidth: 2,
        },
        rightAvatar: {
            bottom: 0,
            left: 0,
            position: 'absolute',
            borderColor: 'white',
            borderWidth: 2,
        },
        textAvatar: {
            bottom: 0,
            right: 0,
            position: 'absolute',
            borderColor: 'white',
            borderWidth: 2,
            backgroundColor: globalStyle?.gray_tone_3,
        },
        avatars: {
            width: normalAvatar,
            height: normalAvatar,
        },
        nameContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        }
    })
};

export default ChatList;
