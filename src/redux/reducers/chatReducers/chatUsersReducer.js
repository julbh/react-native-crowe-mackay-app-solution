import {GET_CHAT_USERS, SET_CHAT_USERS} from '../../constants/chatConstants';

const initialState = [];

export const chatUsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHAT_USERS:
            return [...action.data];
        default:
            return state;
    }
};
