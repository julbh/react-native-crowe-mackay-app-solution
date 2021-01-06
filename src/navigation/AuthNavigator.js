import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SigninScreen from '../screens/Auth/SignIn';
import {LandingScreen} from "../screens/Auth/LandingScreen";

const INITIAL_ROUTE_NAME = 'LandingScreen';

const Stack = createStackNavigator();

export default function AuthNavigator({ navigation, route }) {
    // navigation.setOptions({ headerTitle: getHeaderTitle(route) });

    return (
        <Stack.Navigator initialRouteName={INITIAL_ROUTE_NAME} headerMode="none">
            <Stack.Screen name="LandingScreen" component={LandingScreen} />
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
