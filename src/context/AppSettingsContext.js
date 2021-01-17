import React, {useContext, useReducer} from 'react';
import {getAppSettingsService} from "../services/settings";
import {globalStyle} from "../assets/style";
import {
    ENV_APP_PREFIX,
    ENV_APP_NAME,
} from '@env';

const initialState = {
    config: {
        style: {...globalStyle},
        app_settings: {
            "microapp_tabs": [],
            "feed": true,
            "chat": true,
            "inbox": true,
            "microapp": true,
            "allow_public_registration": false,
            "auth_strategy": "SIMPLE"
        },
        loading_logo: "https://assets.tcog.hk/drshrtfarg.png",
        prefix: ENV_APP_PREFIX || "",
        app_name: ENV_APP_NAME,
    },
    loading: false,
    error: null,
};

const AppSettingsStateContext = React.createContext(initialState);
const AppSettingsDispatchContext = React.createContext();

function AppSettingsReducer(state = initialState, action) {
    switch (action.type) {
        case "GET_SETTINGS_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "GET_SETTINGS_SUCCESS":
            return {
                ...state,
                config: {
                    ...action.data,
                    style: {
                        ...globalStyle,
                        ...action.data.style,
                    }
                },
                loading: true,
            };
        case "GET_SETTINGS_FAILED":
            return {
                ...state,
                loading: false,
                error: action.data,
            };
        case "USE_DEFAULT_SETTINGS":
            return initialState;
        default:
            return state;
    }
}

function AppSettingsProvider({children}) {
    const [state, dispatch] = useReducer(AppSettingsReducer, initialState);
    return (
        <AppSettingsStateContext.Provider value={state}>
            <AppSettingsDispatchContext.Provider value={dispatch}>
                {children}
            </AppSettingsDispatchContext.Provider>
        </AppSettingsStateContext.Provider>
    )
}

function useAppSettingsState() {
    const context = useContext(AppSettingsStateContext);
    if (!Boolean(context)) {
        return {};
    }
    return context;
}

function useAppSettingsDispatch() {
    const context = useContext(AppSettingsDispatchContext);
    if (!Boolean(context)) {
        return null;
    }
    return context;
}

function getAppSettings(dispatch, code) {
    return new Promise((resolve, reject) => {
        dispatch({type: "GET_SETTINGS_REQUEST"});
        getAppSettingsService(code).then(res => {
            console.log('app settings ==> ', res?.data)
            if (res) {
                dispatch({type: "GET_SETTINGS_SUCCESS", data: res?.data});
            }
            resolve(true);
        }).catch(err => {
            dispatch({type: "GET_SETTINGS_REQUEST", data: err});
            reject(err);
        })
    })
}

function useDefaultSettings(dispatch) {
    dispatch({type: "USE_DEFAULT_SETTINGS"});
}

export {
    AppSettingsStateContext,
    AppSettingsProvider,
    useAppSettingsDispatch,
    useAppSettingsState,
    getAppSettings,
    useDefaultSettings,
}
