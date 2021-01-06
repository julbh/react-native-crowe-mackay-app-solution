import {FETCH_DB_LIST_ERR, FETCH_DB_LIST_REQ, FETCH_DB_LIST_SUC, SET_DB_LIST} from '../constants/microAppConstants';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const dbListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DB_LIST:
            return {
                ...state,
                data: [...action.data]
            };
        case FETCH_DB_LIST_REQ:
            return {
                ...state,
                loading: true,
            };
        case FETCH_DB_LIST_SUC:
            return {
                ...state,
                loading: false,
                data: [...action.data],
            };
        case FETCH_DB_LIST_ERR:
            return {
                ...state,
                loading: false,
                error: action.data,
            };
        default:
            return state;
    }
};
