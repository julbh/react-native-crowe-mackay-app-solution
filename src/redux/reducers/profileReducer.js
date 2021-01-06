import {SET_USER_PROFILE} from '../constants/profileConstants';

const initialState = {

};

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_PROFILE:
            return {...action.data};
        default:
            return state;
    }
};
