/**
 * Crowe Mackay Wrapper App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect, useReducer} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
    KeyboardAvoidingView,
    Animated,
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    Image,
    StatusBar,
    Platform,
    YellowBox, LogBox, ScrollView, SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AuthNavigator from './src/navigation/AuthNavigator';
import HomeNavigator from './src/navigation/HomeNavigator';
import SplashScreen from './src/screens/Auth/SplashScreen';
import {doLogin, tokenVerify} from './src/services/auth';
import {BASE_URL, CHANNELS_APP_CLUSTER, CHANNELS_APP_KEY, CHAT_EVENT, SUBSCRIBE_TO_CHANNEL} from './src/config';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './src/redux/reducers';
import {globalStyle} from './src/assets/style';
import PlayScreen from './src/screens/Common/PlayScreen';
import * as Actions from './src/redux/actions';
import {ReduxNetworkProvider} from 'react-native-offline';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider as PaperProvider} from 'react-native-paper';
import Pusher from 'pusher-js/react-native';
import ChatNav from './src/screens/Home/Feed/ChatPage/ChatNav';
import VideoDialog from './src/screens/Common/VideoDialog';
import MToast from 'react-native-toast-message';
import WebViewScreen from './src/screens/Common/WebViewScreen';
import {
    AppSettingsProvider,
    getAppSettings,
    useAppSettingsDispatch, useAppSettingsState,
    useDefaultSettings,
} from './src/context/AppSettingsContext';
import {
    ENV_APP_PREFIX,
    ENV_MULTI_TENANCY,
} from '@env';

// import {getCategories} from './src/services/microApps/wcService';

// Pusher.logToConsole = true;

// const Tab = createBottomTabNavigator();
export const AuthContext = React.createContext();
const Stack = createStackNavigator();

axios.defaults.baseURL = BASE_URL;

export const pusher = new Pusher(CHANNELS_APP_KEY, {
    cluster: CHANNELS_APP_CLUSTER,
});

// YellowBox.ignoreWarnings(['Setting a timer']);
LogBox.ignoreLogs(['Setting a timer']);

const store = createStore(rootReducer,
    applyMiddleware(
        thunkMiddleware,
    ),
);

export default App = () => {

    /*getCategories().then(res => {
        console.log('woocommerce api category ===> ', res)
    })*/

    return (
        <Provider store={store}>
            <ReduxNetworkProvider>
                <PaperProvider>
                    <MenuProvider>
                        <AppSettingsProvider>
                            <Main/>
                        </AppSettingsProvider>
                    </MenuProvider>
                </PaperProvider>
            </ReduxNetworkProvider>
        </Provider>);
};

const Main = () => {
    const flag = ENV_MULTI_TENANCY === "1";
    const appSettingDispatch = useAppSettingsDispatch();
    const dispatch = useDispatch();
    const state = useSelector(({userData}) => userData);
    const dialogState = useSelector(({dialogState}) => dialogState);
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';

    React.useEffect(() => {
        let channel = pusher.subscribe(SUBSCRIBE_TO_CHANNEL);
        /*channel.bind('my-event', function(data) {
            Alert.alert(JSON.stringify(data));
        });*/
        tokenVerify().then(async (res) => {
            try {
                let app_prefix = await AsyncStorage.getItem('app_prefix');
                if (flag) {
                    let response = await getAppSettings(appSettingDispatch, app_prefix);
                }else {
                    let response = await useDefaultSettings(appSettingDispatch);
                }
                global.app_prefix = app_prefix;
                dispatch({type: 'REFRESH_TOKEN', access_token: res.token, id_token: res.id_token});
            } catch (e) {
                dispatch({type: 'REFRESH_TOKEN', access_token: null});
            }
        }).catch(err => {
            dispatch({type: 'REFRESH_TOKEN', access_token: null});
        });
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async data => {
                dispatch({type: 'SIGN_IN_REQ'});
                doLogin(data).then(res => {
                    // dispatch({type: 'SIGN_IN_SUC', token: res});
                    dispatch({type: 'SIGN_IN_SUC', access_token: res.token, id_token: res.id_token});
                }).catch(err => {
                    dispatch({type: 'SIGN_IN_ERR'});
                });
                // dispatch({type: 'SIGN_OUT', token: 'dummy-auth-token'});
            },
            signOut: () => {
                dispatch({type: 'SIGN_OUT'});
            },
            signUp: async data => {
                dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
            },
        }),
        [],
    );

    if (state.isLoading) {
        // We haven't finished checking for the token yet
        return <SplashScreen/>;
    }

    return (
        <>
            <View style={{height: Platform.OS === 'ios' ? 35 : 0, backgroundColor: globalStyle.common_header_color}}>
                <StatusBar/>
            </View>
            <AuthContext.Provider value={authContext}>

                <NavigationContainer>
                    <Stack.Navigator headerMode={'none'}>
                        {!auth_strategy && state.access_token === null ? (
                            <Stack.Screen name="Auth" component={AuthNavigator}/>
                        ) : (
                            <>
                                <Stack.Screen name="Home" component={HomeNavigator}/>
                                <Stack.Screen name={'ChatNav'} component={ChatNav}/>
                                <Stack.Screen name={'WebViewScreen'} component={WebViewScreen}/>
                            </>
                        )}
                    </Stack.Navigator>
                </NavigationContainer>
                {
                    dialogState.state !== 2 &&
                    dialogState.format === 'MP3' ?
                        <PlayScreen/> :
                        dialogState.state !== 2 &&
                        dialogState.format === 'MP4' &&
                        <VideoDialog/>
                }
                <MToast ref={(ref) => MToast.setRef(ref)}/>
            </AuthContext.Provider>
        </>
    );
};

let style = StyleSheet.create({
    header: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        textAlign: 'center',
        fontWeight: '500',
        paddingBottom: 20,
    },
    input: {
        borderWidth: 1,
        width: '100%',
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 18,

    },
    loginBtn: {
        width: 200,
        color: 'white',
    },
    btnBackground: {
        width: '100%',
        height: 40,
        //backgroundColor: "blue",
        borderRadius: 4,
        backgroundColor: 'rgb(244,158,48)',
    },
});
