import {
    APPEND_CHAT_MESSAGE,
    GET_CHAT_HISTORY_SUC, GET_CHAT_MESSAGE_ERR,
    GET_CHAT_MESSAGE_REQ, GET_CHAT_MESSAGE_SUC,
    SET_CHAT_MESSAGE,
} from '../../constants/chatConstants';

const initialState = {
    data: [],
    loading: false,
};

export const chatMessageReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CHAT_MESSAGE_REQ:
            return {
                ...state,
                loading: true,
            };
        case GET_CHAT_MESSAGE_SUC:
            return {
                ...state,
                data: [...action.data.reverse(), ...state.data],
                loading: false,
            };
        case GET_CHAT_MESSAGE_ERR:
            return {
                ...state,
                loading: false,
            };
        case SET_CHAT_MESSAGE:
            return {
                ...state,
                data: [...action.data.reverse()]
            };
            // return [...action.data.reverse()];
        case APPEND_CHAT_MESSAGE:
            return {
                ...state,
                data: [{...action.data}, ...state.data]
            };
            // return [{...action.data}, ...state];
        default:
            return state;
    }
};
