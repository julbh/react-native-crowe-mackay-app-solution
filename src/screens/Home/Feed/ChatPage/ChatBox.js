import React, {useState, useEffect, useRef} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
    renderInputToolbar,
    renderActions,
    renderComposer,
    renderSend,
} from '../components/ChatboxComponent/InputToolbar';
import {
    renderAvatar,
    renderBubble,
    renderSystemMessage,
    renderMessage,
    renderMessageText,
    renderCustomView, renderMessageImage, renderLoading, renderFooter, renderScrollToBottomComponent,
} from '../components/ChatboxComponent/MessageContainer';
import {ActivityIndicator, Alert, KeyboardAvoidingView, View, Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as chatService from '../../../../services/feed/chatService';
import jwtDecode from 'jwt-decode';
import ObjectID from 'bson-objectid';
import {pusher} from '../../../../../App';
import {CHAT_EVENT} from '../../../../config';
import * as Action from '../../../../redux/actions'
import ChatboxLoading from '../components/ChatboxComponent/ChatboxLoading';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

const ChatBox = (props) => {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';

    const dispatch = useDispatch();
    const chatMessages = useSelector(({chatMessage}) => chatMessage);
    const chatHistoryData = useSelector(({chatHistoryData}) => chatHistoryData);
    const [currentHistory, setCurrentHistory] = useState(null);

    const [text, setText] = useState('');
    let chatUsersReducer = useSelector((rootReducer) => rootReducer.chatUsersReducer);
    let userData = useSelector((rootReducer) => rootReducer.userData);

    const [params, setParams] = useState(null);
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [bottomPadding, setPadding] = useState(0);
    const ref = useRef(null);

    /////keyboard listener
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {
        setPadding(25);
        // alert("Keyboard Shown");
    };

    const _keyboardDidHide = () => {
        setPadding(0);
        // alert("Keyboard Hidden");
    };


    useEffect(() => {
        ref.current = true;
        return () => ref.current = null;
    }, []);

    useEffect(() => {
        setMessages(chatMessages.data);
    }, [chatMessages]);

    useEffect(() => {
        let params = props.route.params;
        let currentChannel = params.item.channel;
        let tmp = chatHistoryData.data.filter(o => o.data.channel_payload.channel === currentChannel);
        setCurrentHistory(tmp[0]);
    }, [chatHistoryData]);

    useEffect(() => {
        let id_token = userData.id_token;
        let curUser = auth_strategy ? {} : (jwtDecode(id_token));
        let user = {
            avatar: curUser.picture,
            name: curUser.full_name,
            _id: curUser.user_id,
        };
        setUser(user);
        let params = props.route.params;
        console.log('params ===> ', params)
        setParams(params);
        if(params && params.type === undefined){
            dispatch(Action.getChatMessageAction(curUser._id, params.item.channel));
        }else if(params.type === "NEW_CHAT"){
            dispatch(Action.setChatMessageAction([]));
            // setMessages([]);
        }
    }, [userData]);

    const onSend = async (newMessages = []) => {
        try{
            // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
            let data = {
                event: CHAT_EVENT,
                channel: params.item.channel,
                channel_payload: {
                    _user_ids: params.item._user_ids,
                    composedAt: newMessages[0].createdAt,
                    user: newMessages[0].user,
                    text: newMessages[0].text,
                    read: true,
                    // _id: newMessages[0]._id,
                    _id: ObjectID(),
                    channel: params.item.channel,
                }
            };
            let res = await chatService.sendMessageService(data);
            console.log('res ===> ', res);
        }catch (e) {
            console.log('error ===> ', e);
        }
    };

    console.log('currentHistory history ==> ', currentHistory)

    if(props?.route?.params?.type !== 'NEW_CHAT' && !Boolean(currentHistory)){
        return <ChatboxLoading/>
    }

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            // behavior={'position'}
            // keyboardVerticalOffset={-150}
        >
            <GiftedChat
                // messages={chatMessages}
                messages={messages}
                text={text}
                onInputTextChanged={setText}
                onSend={onSend}
                /*user={{
                    _id: "1",
                    name: 'Aaron',
                    avatar: 'https://placeimg.com/150/150/any',
                }}*/
                user={user}
                alignTop
                alwaysShowSend
                scrollToBottom
                scrollToBottomStyle={{backgroundColor: 'grey'}}
                scrollToBottomComponent={renderScrollToBottomComponent}
                showUserAvatar={false}
                // renderAvatarOnTop
                // renderUsernameOnMessage
                bottomOffset={26}
                onPressAvatar={console.log}
                renderInputToolbar={renderInputToolbar}
                // renderActions={renderActions}
                renderComposer={renderComposer}
                renderSend={renderSend}
                renderAvatar={null}
                // renderAvatar={renderAvatar}
                renderBubble={renderBubble}
                renderSystemMessage={renderSystemMessage}
                renderMessage={renderMessage}
                renderMessageText={renderMessageText}
                renderMessageImage={renderMessageImage}
                isAnimated
                renderCustomView={renderCustomView}
                // isCustomViewBottom={false}
                messagesContainerStyle={{backgroundColor: 'white', paddingBottom: bottomPadding,}}
                // renderLoading={renderLoading}
                isLoadingEarlier={chatMessages.loading}
                // infiniteScroll={true}
                loadEarlier={chatMessages.loading}
                keyboardShouldPersistTaps='never'
                /*listViewProps={{
                    scrollEventThrottle: 400,
                }}*/
                // isTyping={true}
                // renderFooter={renderFooter}
                parsePatterns={(linkStyle) => [
                    {
                        pattern: /#(\w+)/,
                        style: linkStyle,
                        onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
                    },
                ]}
            />
            {/*{
                Platform.OS === 'android' &&
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-150}/>
            }*/}
        </KeyboardAvoidingView>
    );
};

export default ChatBox;
