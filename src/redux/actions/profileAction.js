import {SET_USER_PROFILE} from '../constants/profileConstants';

export const setProfileAction = (profile) => {
    return (dispatch, getState) => {
        dispatch({type: SET_USER_PROFILE, data: profile});
    }
};
