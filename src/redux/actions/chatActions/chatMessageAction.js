import _ from 'lodash';
import {
    APPEND_CHAT_MESSAGE,
    GET_CHAT_HISTORY_SUC, GET_CHAT_MESSAGE_ERR,
    GET_CHAT_MESSAGE_REQ, GET_CHAT_MESSAGE_SUC,
    SET_CHAT_MESSAGE,
} from '../../constants/chatConstants';
import {CHAT_EVENT, SUBSCRIBE_TO_CHANNEL} from '../../../config';
import {getChatHistoryService} from '../../../services/feed/chatService';

export const appendChatMessageAction = (newMessage) => {
    return (dispatch, getState) => {
        dispatch({type: APPEND_CHAT_MESSAGE, data: newMessage});
    }
};

export const setChatMessageAction = (newMessage) => {
    return (dispatch, getState) => {
        dispatch({type: SET_CHAT_MESSAGE, data: newMessage})
    }
};

export const getChatMessageAction = (user_id, channel) => {
    return (dispatch, getState) => {
        let data = {
            event: CHAT_EVENT,
            channel,
            user_id,
        };
        dispatch({type: GET_CHAT_MESSAGE_REQ});
        getChatHistoryService(data).then(res => {
            dispatch({type: GET_CHAT_MESSAGE_SUC, data: res})
            // dispatch({type: SET_CHAT_MESSAGE, data: res})
        }).catch(err => {
            dispatch({type: GET_CHAT_MESSAGE_ERR, data: []})
            // dispatch({type: SET_CHAT_MESSAGE, data: []})
        })
    }
};
