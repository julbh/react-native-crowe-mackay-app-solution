import {SET_APP_LOADING, SET_APP_STATUS} from '../constants/appConstants';

const initialState = {
    loading: false,
};

export const appStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_APP_STATUS:
            return {...action.data};
        case SET_APP_LOADING:
            return {
                ...action,
                loading: action.data,
            };
        default:
            return state;
    }
};
