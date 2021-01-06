import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET_CHAT_USERS, SET_CHAT_USERS, SET_SELECTED_USERS} from '../../constants/chatConstants';

export const getChatUsersAction = () => {
    return (dispatch, getState) => {
        dispatch({type: GET_CHAT_USERS});
    }
};

export const setChatUsersAction = (currentUsers) => {
    return async (dispatch, getState) => {
        dispatch({type: SET_CHAT_USERS, data: currentUsers});
        await AsyncStorage.setItem('chatUsers', JSON.stringify(currentUsers));
    }
};

export const setSelectedUsersAction = (currentUsers) => {
    return (dispatch, getState) => {
        dispatch({type: SET_SELECTED_USERS, data: currentUsers});
    }
};
