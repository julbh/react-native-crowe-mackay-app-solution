import {FETCH_PRO_ERROR, FETCH_PRO_REQUEST, FETCH_PRO_SUCCESS} from '../constants/programConstants';
import {
    DIALOG_STATE,
    SET_MEDIA_TYPE,
    SET_PLAY_DIALOG,
    SET_PLAY_MODE,
    SET_START_SONG,
} from '../constants/microAppConstants';

const initialState = {
    state: DIALOG_STATE.CLOSED,
    mode: 'LIST', // "LIST", "ITEM", "DOWNLOADED"
    start: {
        id: null,
        position: 0,
    },
    format: "MP3",  // MP3, MP4
    album_id: undefined,
};

export const dialogReducer = (state = initialState, action) => {
    switch (action.type) {
        // change state, format
        case SET_PLAY_DIALOG:
            /*return {
                ...state,
                ...action.data,
            };*/
            return {
                ...state,
                state: action.data,
            };
        case SET_MEDIA_TYPE:
            return {
                ...state,
                format: action.data.format,
                album_id: action.data.album_id,
            };
        case SET_START_SONG:
            return {
                ...state,
                start: {...action.data},
            };
        case SET_PLAY_MODE:
            return {
                ...state,
                mode: action.data,
            };
        default:
            return state;
    }
};
