import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import ChatListHeader from '../components/ChatListHeader';
import NewChat from './NewChat';
import NewChatHeader from '../components/NewChatHeader';
import ChatBoxHeader from '../components/ChatBoxHeader';
import {useDispatch, useSelector} from 'react-redux';
import {CHAT_EVENT, SUBSCRIBE_TO_CHANNEL} from '../../../../config';
import ObjectID from 'bson-objectid';
import * as chatService from '../../../../services/feed/chatService';
import {SET_CHAT_MESSAGE} from '../../../../redux/constants/chatConstants';
import * as Actions from '../../../../redux/actions';
import {Alert} from 'react-native';
import {isExistUsersInArray} from '../../../../services/common';
import {updateHistoryService} from '../../../../services/feed/chatService';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

const Stack = createStackNavigator();

export default function ChatNav(props) {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';

    let {navigation} = props;

    const dispatch = useDispatch();

    const userData = useSelector((rootReducer) => rootReducer.userData);
    const chatHistoryData = useSelector(({chatHistoryData}) => chatHistoryData);
    const chatUsersReducer = useSelector((rootReducer) => rootReducer.chatUsersReducer);
    const selectedUsers = useSelector((rootReducer) => rootReducer.selectedUsers);
    const [user, setUser] = useState({});

    useEffect(() => {
        let user = auth_strategy ? {} : (jwtDecode(userData.id_token));
        // let user = (jwtDecode(userData.id_token));
        setUser(user);
    }, []);

    const newChat = async () => {
        if (selectedUsers.length === 0) {
            Alert.alert('You didn\'t select any users!\n Please select one at least.');
            return;
        }
        let channel = '';
        let ids = [];
        let users = [];
        // add others
        selectedUsers.map(item => {
            channel += `@${item._id}`;
            ids.push(item._id);
            /*let tmp = {
                _id: item._id,
                full_name: item.data.full_name,
                picture: item.data.picture,
                email: item.data.email,
                position: item.data.position,
            };*/
            let tmp = {
                _id: item._id,
                full_name: item.full_name,
                picture: item.picture,
                email: item.email,
                position: item.bio,
            };
            users.push(tmp);
        });
        //add me
        channel += `@${user.user_id}`;

        ids.push(user.user_id);
        let tmp = {
            _id: user?.user_id,
            full_name: user?.full_name,
            picture: user?.picture,
            email: user?.email,
            position: user?.position,
        };
        users.push(tmp);

        let data = {
            event: CHAT_EVENT,
            channel: SUBSCRIBE_TO_CHANNEL,
            channel_payload: {
                _user_ids: ids,
                composedAt: moment().toISOString(),
                type: SUBSCRIBE_TO_CHANNEL,
                channel: channel,
                users: users,
                user: {
                  name: user.full_name,
                  avatar: user.picture,
                },
                // _id: ObjectID(),
                _id: "5f9b630eac8bb2213f27d915",
            },
        };
        console.log('new chat ===> ', data)
        dispatch(Actions.setChatUsersAction(users));

        dispatch(Actions.setSelectedUsersAction([]));
        if (isExistUsersInArray(chatHistoryData.data, users)) {
            navigation.navigate({
                name: 'ChatBox',
                params: {
                    item: {
                        ...data.channel_payload,
                        composedAt: data.channel_payload.composedAt.toString(),
                        _id: data.channel_payload._id.toString(),
                    },
                },
            });
        } else {
            let res = await chatService.sendMessageService(data);
            navigation.navigate({
                name: 'ChatBox',
                params: {
                    type: 'NEW_CHAT', item: {
                        ...data.channel_payload,
                        composedAt: data.channel_payload.composedAt.toString(),
                        _id: data.channel_payload._id.toString(),
                    },
                },
            });
        }
    };

    const goBackFromChat = (navigation) => {
        let channel = '';
        chatUsersReducer.reverse().map(item => {
            channel += `@${item._id}`;
        });

        const includeUsers = (channel) => {
          let f = true;
          chatUsersReducer.map(item => {
              if(!(channel.includes(item._id))){
                  f = false;
              }
          });
          return f;
        };

        // let curHistory = chatHistoryData.data.filter(o => o.data.channel_payload.channel === channel)[0];
        let curHistory = chatHistoryData.data.filter(o => includeUsers(o.data.channel_payload.channel))[0];
        console.log('back from chat ************** ', chatHistoryData, curHistory, chatUsersReducer)

        let curData = curHistory.data;
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
        console.log('update read status ==> ', curData, newData, user.user_id);
        updateHistoryService(curHistory._id, newData).then(res => {
            dispatch(Actions.getChatHistoryAction(user.user_id));
            navigation.goBack();
            dispatch({type: SET_CHAT_MESSAGE, data: []});
            dispatch(Actions.setChatUsersAction([]));
        }).catch(err => {
        });
    };

    return (
        <Stack.Navigator initialRouteName={'ChatList'}>
            <Stack.Screen
                name="ChatList"
                component={ChatList}
                options={{
                    title: 'Chat',
                    header: ({scene, previous, navigation}) => {
                        const {options} = scene.descriptor;
                        const title =
                            options.headerTitle !== undefined
                                ? options.headerTitle
                                : options.title !== undefined
                                ? options.title
                                : scene.route.name;
                        return (
                            <ChatListHeader
                                title={title}
                                goBack={() => navigation.goBack()}
                                openNew={() => navigation.navigate('NewChat')}
                            />
                        );
                    },
                }}
            />
            <Stack.Screen
                name="NewChat"
                component={NewChat}
                options={{
                    title: 'New Message',
                    header: ({scene, previous, navigation}) => {
                        const {options} = scene.descriptor;
                        const title =
                            options.headerTitle !== undefined
                                ? options.headerTitle
                                : options.title !== undefined
                                ? options.title
                                : scene.route.name;
                        return (
                            <NewChatHeader
                                title={title}
                                goBack={() => navigation.goBack()}
                                openChatBox={newChat}
                            />
                        );
                    },
                }}
            />
            <Stack.Screen
                name="ChatBox"
                component={ChatBox}
                options={{
                    title: 'Message',
                    header: ({scene, previous, navigation}) => {
                        const {options} = scene.descriptor;
                        const title =
                            options.headerTitle !== undefined
                                ? options.headerTitle
                                : options.title !== undefined
                                ? options.title
                                : scene.route.name;
                        return (
                            <ChatBoxHeader
                                title={title}
                                chatUsers={chatUsersReducer}
                                goBack={() => {
                                    goBackFromChat(navigation)
                                }}
                            />
                        );
                    },
                }}
            />
        </Stack.Navigator>
    );
};
