import _ from 'lodash';
import {GET_COUNTERS_ERR, GET_COUNTERS_REQ, GET_COUNTERS_SUC, SET_COUNTERS} from '../constants/microAppConstants';
import {getCountersService} from '../../services/microApps/commonService';

export const getCountersAction = (query) => {
    return (dispatch, getState) => {
        dispatch({type: GET_COUNTERS_REQ});
        getCountersService(query).then((res) => {
            dispatch({type: GET_COUNTERS_SUC, data: res});
        }).catch(error => {
            dispatch({type: GET_COUNTERS_ERR, data: error});
        })
    }
};

export const setCountersAction = (data) => {
    return (dispatch, getState) => {
        dispatch({type: SET_COUNTERS, data: data});
    }
};
