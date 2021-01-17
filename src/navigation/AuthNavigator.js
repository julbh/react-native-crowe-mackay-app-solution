import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SigninScreen from '../screens/Auth/SignIn';
import {LandingScreen} from "../screens/Auth/LandingScreen";
import {
    ENV_APP_PREFIX,
    ENV_MULTI_TENANCY,
} from '@env';
import {useEffect} from 'react';
import {useAppSettingsDispatch, useAppSettingsState, useDefaultSettings} from '../context/AppSettingsContext';

const INITIAL_ROUTE_NAME = ENV_MULTI_TENANCY ? 'LandingScreen' : 'SignIn';

const Stack = createStackNavigator();

export default function AuthNavigator({ navigation, route }) {
    // navigation.setOptions({ headerTitle: getHeaderTitle(route) });
    const appSettingDispatch = useAppSettingsDispatch();
    const appSettingsState = useAppSettingsState();

    let flag = ENV_MULTI_TENANCY === "1";
    useEffect(() => {
        if(!flag) useDefaultSettings(appSettingDispatch);
    }, []);
    console.log('=========> ',ENV_APP_PREFIX, Boolean(ENV_MULTI_TENANCY), ENV_MULTI_TENANCY, flag, appSettingsState)

    return (
        <Stack.Navigator initialRouteName={INITIAL_ROUTE_NAME} headerMode="none">
            {flag && <Stack.Screen name="LandingScreen" component={LandingScreen} />}
            <Stack.Screen name="SignIn" component={SigninScreen} />
        </Stack.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Home':
            return 'How to get started';
        case 'Links':
            return 'Links to learn more';
    }
}
