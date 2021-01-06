import {
    FETCH_PLAYLIST_ERROR, FETCH_PLAYLIST_REQUEST, FETCH_PLAYLIST_SUCCESS, SET_FORMATTED_LIST,
} from '../constants/microAppConstants';

const initialState = {
    loading: false,
    data: {},
    formattedList: [],
    error: null
};

export const playlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PLAYLIST_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: [...action.data],
            };
        case FETCH_PLAYLIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case SET_FORMATTED_LIST:
            return {
                ...state,
                formattedList: action.data,
            };
        default:
            return state;
    }
};
