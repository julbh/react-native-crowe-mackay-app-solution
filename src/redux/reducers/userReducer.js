import {FETCH_FEED_ERROR, FETCH_FEED_REQUEST, FETCH_FEED_SUCCESS, SET_FEED_DATA} from '../constants/feedConstants';

const initialState = {
    access_token: null,
    id_token: null,
    isLoading: true,
    isSignout: false,
    user: null,
    data: {},
};

export const userReducer = (prevState = initialState, action) => {
    switch (action.type) {
        case 'REFRESH_TOKEN':
            return {
                ...prevState,
                access_token: action.access_token,
                id_token: action.id_token,
                isLoading: false,
                isSignout: false,
                data: {...action.user_data},
            };
        case 'SET_USER':
            return {
                ...prevState,
                user: action.user,
            };
        case 'SIGN_IN_REQ':
            return {
                ...prevState,
                isLoading: true,
                isSignout: true,
            };
        case 'SIGN_IN_SUC':
            return {
                ...prevState,
                access_token: action.access_token,
                id_token: action.id_token,
                isLoading: false,
                isSignout: false,
                data: {...action.user_data},
            };
        case 'SIGN_IN_ERR':
            return {
                ...prevState,
                isLoading: false,
                isSignout: true,
            };
        case 'SIGN_OUT':
            return {
                ...prevState,
                access_token: null,
                isLoading: false,
                isSignout: true,
            };
        default:
            return prevState;
    }
};
