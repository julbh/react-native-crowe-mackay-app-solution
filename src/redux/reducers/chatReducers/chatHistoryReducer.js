import {
    APPEND_CHAT_HISTORY,
    GET_CHAT_HISTORY_ERR,
    GET_CHAT_HISTORY_REQ,
    GET_CHAT_HISTORY_SUC,
} from '../../constants/chatConstants';

const initialState = {
    data: undefined,
    loading: false,
};

export const chatHistoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CHAT_HISTORY_REQ:
            return {
                ...state,
                loading: true,
            };
        case GET_CHAT_HISTORY_SUC:
            return {
                ...state,
                data: action.data,
                loading: false,
            };
        case GET_CHAT_HISTORY_ERR:
            return {
                ...state,
                data: [],
                loading: false,
            };
        case APPEND_CHAT_HISTORY:
            return {
                ...state,
                data: [...state.data, {...action.data}],
            };
        default:
            return state;
    }
};
