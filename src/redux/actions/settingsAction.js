import {getSettingsService} from '../../services/settings';
import {SET_SETTINGS} from '../constants/settingsConstants';

export const getSettingsAction = () => {
    return (dispatch, getState) => {
        // dispatch({type: FETCH_PRO_REQUEST});
        getSettingsService().then((res) => {
            // console.log('==================> ', res);
            dispatch({type: SET_SETTINGS, data: res});
        }).catch(error => {
            dispatch({type: SET_SETTINGS, error: error});
        })
    }
};

export const setSettingsAction = (settings) => {
    return (dispatch, getState) => {
        dispatch({type: SET_SETTINGS, data: settings});
    }
};
