import {GET_COUNTERS_ERR, GET_COUNTERS_REQ, GET_COUNTERS_SUC, SET_COUNTERS} from '../constants/microAppConstants';

// const initialState = [];
const initialState = {
    data: [],
    loading: false,
    error: null,
};

export const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_COUNTERS_REQ:
            return {
                ...state,
                loading: true,
            };
        case GET_COUNTERS_SUC:
            return {
                ...state,
                data: action.data,
                loading: false,
            };
        case GET_COUNTERS_ERR:
            return {
                ...state,
                error: action.data,
                loading: false,
            };
        case SET_COUNTERS:
            return {
                ...state,
                data: action.data,
            };
        default:
            return state;
    }
};
