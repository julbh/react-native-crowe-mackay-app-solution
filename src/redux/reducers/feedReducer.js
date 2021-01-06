import {FETCH_FEED_ERROR, FETCH_FEED_REQUEST, FETCH_FEED_SUCCESS, SET_FEED_DATA} from '../constants/feedConstants';

const initialState = {
    loading: false,
    feed: [],
    error: null
};

export const feedReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_FEED_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_FEED_SUCCESS:
            return {
                ...state,
                loading: false,
                feed: action.data,
            };
        case FETCH_FEED_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case SET_FEED_DATA:
            return {
                ...state,
                feed: action.data,
            };
        default:
            return state;
    }
};
