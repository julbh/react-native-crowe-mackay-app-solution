import {FETCH_PRO_ERROR, FETCH_PRO_REQUEST, FETCH_PRO_SUCCESS} from '../constants/programConstants';
import {getPrograms, getProgramsByUrl} from '../../services/program';

export const getProAction = (permission) => {
    return (dispatch, getState) => {
        dispatch({type: FETCH_PRO_REQUEST});
        getPrograms(permission).then((res) => {
            // console.log('==================> ', res);
            dispatch({type: FETCH_PRO_SUCCESS, data: res});
        }).catch(error => {
            dispatch({type: FETCH_PRO_ERROR, error: error});
        })
    }
};

export const getProByUrlAction = (fetch_collection) => {
    return (dispatch, getState) => {
        dispatch({type: FETCH_PRO_REQUEST});
        getProgramsByUrl(fetch_collection).then((res) => {
            // console.log('==================> ', res);
            dispatch({type: FETCH_PRO_SUCCESS, data: res});
        }).catch(error => {
            dispatch({type: FETCH_PRO_ERROR, error: error});
        })
    }
};
