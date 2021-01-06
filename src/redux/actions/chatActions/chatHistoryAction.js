import _ from 'lodash';
import {
    APPEND_CHAT_HISTORY,
    GET_CHAT_HISTORY_ERR, GET_CHAT_HISTORY_REQ,
    GET_CHAT_HISTORY_SUC,
} from '../../constants/chatConstants';
import {CHAT_EVENT, SUBSCRIBE_TO_CHANNEL} from '../../../config';
import {getChatHistoryService} from '../../../services/feed/chatService';

export const getChatHistoryAction = (user_id) => {
    return (dispatch, getState) => {
        dispatch({type: GET_CHAT_HISTORY_REQ});
        let data = {
            event: CHAT_EVENT,
            // event: CHAT_EVENT,
            channel: SUBSCRIBE_TO_CHANNEL,
            user_id,
        };
        getChatHistoryService(data).then(res => {
            dispatch({type: GET_CHAT_HISTORY_SUC, data: res});
        }).catch(err => {
            dispatch({type: GET_CHAT_HISTORY_ERR});
        })
    }
};

export const appendChatHistoryAction = (data) => {
    return (dispatch, getState) => {
        dispatch({type: APPEND_CHAT_HISTORY, data: data});
    }
}
