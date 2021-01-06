import {GET_COMMENTS_ERR, GET_COMMENTS_REQ, GET_COMMENTS_SUC, SET_COMMENTS} from '../constants/microAppConstants';

const initialState = {
    loading: false,
    data: [],
    error: null,
};

export const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COMMENTS:
            return {
                ...state,
                data: [...action.data],
            };
        case GET_COMMENTS_REQ:
            return {
                ...state,
                loading: true,
            };
        case GET_COMMENTS_SUC:
            return {
                ...state,
                data: [...action.data],
                loading: false
            };
        case GET_COMMENTS_ERR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
