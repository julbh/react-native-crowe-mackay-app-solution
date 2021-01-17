import {SET_USER_PROFILE} from '../constants/profileConstants';

const initialState = {
    data: {}
};

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_PROFILE:
            return {
                ...state,
                data: {...action.data}
            };
        default:
            return state;
    }
};
