import {
    dynamicFetch,
    getAlbumsService,
    getCommentService,
    getMicroAppsService,
    getPlaylistService,
} from '../../services/microApps';
import {
    FETCH_ALBUM_ERROR,
    FETCH_ALBUM_REQUEST,
    FETCH_ALBUM_SUCCESS, FETCH_DB_LIST_ERR, FETCH_DB_LIST_REQ, FETCH_DB_LIST_SUC,
    FETCH_MICRO_APP_ERROR,
    FETCH_MICRO_APP_REQUEST,
    FETCH_MICRO_APP_SUCCESS,
    FETCH_PLAYLIST_ERROR,
    FETCH_PLAYLIST_REQUEST,
    FETCH_PLAYLIST_SUCCESS, GET_COMMENTS_ERR, GET_COMMENTS_REQ, GET_COMMENTS_SUC, SET_COMMENTS, SET_DB_LIST,
    SET_FORMATTED_LIST,
    SET_MEDIA_TYPE,
    SET_MICRO_APP_DATA,
    SET_PLAY_DIALOG,
    SET_PLAY_MODE,
    SET_START_SONG,
} from '../constants/microAppConstants';
import * as Actions from './index';

export const getMicroAppAction = () => {
    return (dispatch, getState) => {
        dispatch({type: FETCH_MICRO_APP_REQUEST});
        getMicroAppsService().then((res) => {
            dispatch({type: FETCH_MICRO_APP_SUCCESS, data: res});
        }).catch(error => {
            dispatch({type: FETCH_MICRO_APP_ERROR, error: error});
        });
    };
};

export const setMicroParentAction = (data) => {
    return (dispatch, getState) => {
        dispatch({type: SET_MICRO_APP_DATA, data: data});
    };
};

export const getAlbumsAction = (url) => {
    return (dispatch, getState) => {
        dispatch({type: FETCH_ALBUM_REQUEST});
        getAlbumsService(url).then((res) => {
            dispatch({type: FETCH_ALBUM_SUCCESS, data: res});
        }).catch(error => {
            dispatch({type: FETCH_ALBUM_ERROR, error: error});
        });
    };
};

export const getPlaylistAction = (album_id) => {
    return (dispatch, getState) => {
        dispatch({type: FETCH_PLAYLIST_REQUEST});
        getPlaylistService(album_id).then((res) => {
            dispatch({type: FETCH_PLAYLIST_SUCCESS, data: res});
        }).catch(error => {
            dispatch({type: FETCH_PLAYLIST_ERROR, error: error});
        });
    };
};

export const setDialogStateAction = (state) => {
    return (dispatch, getState) => {
        dispatch({type: SET_PLAY_DIALOG, data: state});
        // dispatch({type: SET_PLAY_DIALOG, data: {state, type}});
    };
};

export const setDialogTypeAction = (format = "MP3", album_id) => {
    return (dispatch, getState) => {
        dispatch({type: SET_MEDIA_TYPE, data: {format, album_id}});
    };
};

export const setStartSongAction = (startInfo) => {
    return (dispatch, getState) => {
        dispatch({type: SET_START_SONG, data: startInfo});
    };
};

export const setPlayModeAction = (mode) => {
    return (dispatch, getState) => {
        dispatch({type: SET_PLAY_MODE, data: mode});
    };
};

export const setFormattedListAction = (playlist) => {
    return (dispatch, getState) => {
        dispatch({type: SET_FORMATTED_LIST, data: playlist});
    };
};

export const getDBListAction = (url) => {
    return (dispatch, getState) => {
        dispatch({type: FETCH_DB_LIST_REQ});
        dynamicFetch(url, 'user_id').then((res) => {
            console.log('dyn fetch ===> ', res);
            dispatch({type: FETCH_DB_LIST_SUC, data: res});
        }).catch(err => {
            dispatch({type: FETCH_DB_LIST_ERR, data: err});
            console.log('dyn fetch err ===> ', err);
        });
    };
};

export const setDBListAction = (list) => {
    return (dispatch, getState) => {
        dispatch({type: SET_DB_LIST, data: list});
    };
};

export const setCommentsAction = (comments) => {
    return (dispatch, getState) => {
        dispatch({type: SET_COMMENTS, data: comments});
    }
};

export const getCommentsAction = (data) => {
    return (dispatch, getState) => {
        dispatch({type: GET_COMMENTS_REQ});
        getCommentService(data).then(res => {
            dispatch({type: GET_COMMENTS_SUC, data: res});
        }).catch(err => {
            dispatch({type: GET_COMMENTS_ERR, data: err});
        })
    }
};


