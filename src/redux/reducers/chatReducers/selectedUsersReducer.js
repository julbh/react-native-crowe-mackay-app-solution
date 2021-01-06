import {GET_CHAT_USERS, SET_CHAT_USERS, SET_SELECTED_USERS} from '../../constants/chatConstants';

const initialState = [];

export const selectedUsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_USERS:
            return [...action.data];
        default:
            return state;
    }
};
