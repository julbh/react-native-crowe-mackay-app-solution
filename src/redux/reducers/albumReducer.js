import {
    FETCH_ALBUM_ERROR,
    FETCH_ALBUM_REQUEST, FETCH_ALBUM_SUCCESS,
} from '../constants/microAppConstants';

const initialState = {
    loading: false,
    albums: {},
    error: null
};

export const albumReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALBUM_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_ALBUM_SUCCESS:
            return {
                ...state,
                loading: false,
                albums: action.data,
            };
        case FETCH_ALBUM_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        /*case SET_MICRO_APP_DATA:
            return {
                ...state,
                parents: action.data,
            };*/
        default:
            return state;
    }
};
