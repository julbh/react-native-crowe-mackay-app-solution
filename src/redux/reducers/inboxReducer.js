import {GET_INBOX_ERR, GET_INBOX_REQ, GET_INBOX_SUC, SET_INBOX_DATA} from '../constants/inboxConstants';

// const initialState = [];
const initialState = {
    data: [],
    loading: false,
    error: null,
};

export const inboxReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INBOX_REQ:
            return {
                ...state,
                loading: true,
            };
        case GET_INBOX_SUC:
            return {
                ...state,
                data: action.data,
                loading: false,
            };
        case GET_INBOX_ERR:
            return {
                ...state,
                error: action.data,
                loading: false,
            };
        case SET_INBOX_DATA:
            return {
                ...state,
                data: action.data,
            };
        /*case SET_INBOX_DATA:
            return [...action.data];*/
        default:
            return state;
    }
};
