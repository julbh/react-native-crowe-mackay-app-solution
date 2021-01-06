import {SET_APP_LOADING, SET_APP_STATUS} from '../constants/appConstants';

export const setAppStatusAction = (status) => {
    return (dispatch, getState) => {
        dispatch({type: SET_APP_STATUS, data: status});
    };
};

export const setAppLoadingAction = (loading) => {
    return (dispatch, getState) => {
        dispatch({type: SET_APP_LOADING, data: loading});
    };
};
