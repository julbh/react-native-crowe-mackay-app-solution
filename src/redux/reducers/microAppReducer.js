import {FETCH_PRO_ERROR, FETCH_PRO_REQUEST, FETCH_PRO_SUCCESS} from '../constants/programConstants';
import {
    FETCH_MICRO_APP_ERROR,
    FETCH_MICRO_APP_REQUEST,
    FETCH_MICRO_APP_SUCCESS,
    SET_MICRO_APP_DATA,
} from '../constants/microAppConstants';

const initialState = {
    loading: false,
    microApps: [],
    parents: [],
    error: null
};

export const microAppReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MICRO_APP_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_MICRO_APP_SUCCESS:
            return {
                ...state,
                loading: false,
                microApps: action.data,
            };
        case FETCH_MICRO_APP_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case SET_MICRO_APP_DATA:
            return {
                ...state,
                parents: action.data,
            };
        default:
            return state;
    }
};
