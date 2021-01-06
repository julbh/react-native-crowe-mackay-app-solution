import {SET_SETTINGS} from '../constants/settingsConstants';

const initialState = [];

export const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SETTINGS:
            return [...action.data];
        default:
            return state;
    }
};
