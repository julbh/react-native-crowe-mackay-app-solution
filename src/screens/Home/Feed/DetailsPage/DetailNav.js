import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FeedDetails from './FeedDetails';
import VideoScreen from './VideoScreen';
// import {globalStyle} from '../../../../assets/style';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

const Stack = createStackNavigator();

Stack.navigationOptions = ({ navigation }) => {

    let tabBarVisible = true;

    let routeName = navigation.state.routes[navigation.state.index].routeName

    if ( routeName === 'VideoScreen' ) {
        tabBarVisible = false
    }

    return {
        tabBarVisible,
    }
};

export default function DetailsNav({navigation}) {
    const {config} = useAppSettingsState();
    const globalStyle = {...config.style};

    // navigation.setOptions({ tabBarVisible: false })

    return (
        <Stack.Navigator initialRouteName={'FeedDetails'}>
            <Stack.Screen
                name="FeedDetails"
                component={FeedDetails}
                options={{
                    title: "Feed Details",
                    headerStyle: {
                        backgroundColor: '#F2F2F2',
                        height: 50,
                        borderBottomColor: globalStyle.gray_tone_3,
                    },
                    headerTintColor: globalStyle.primary_color_2,
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: globalStyle.primary_color_2,
                    },
                }}
            />
            <Stack.Screen
                name="VideoScreen"
                component={VideoScreen}
                options={{
                    headerShown: false,
                    tabBarVisible: false,
                }}
            />
        </Stack.Navigator>
    );
};
