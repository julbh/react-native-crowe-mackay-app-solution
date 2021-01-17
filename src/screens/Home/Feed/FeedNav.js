import React, {useContext} from 'react';
import {createStackNavigator, TransitionSpecs, HeaderStyleInterpolators} from '@react-navigation/stack';
import FeedList from './FeedList';
import UserProfile from './UserProfile';
import DetailsNav from './DetailsPage/DetailNav';
import {Alert, TouchableOpacity} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import FeedListHeader from './components/FeedListHeader';
import {AppSettingsStateContext, useAppSettingsState} from "../../../context/AppSettingsContext";
import NavigationHeader from "../../../components/NavigationHeader";

const config = {
    animation: 'timing',
    // animation: 'spring',
    config: {
        // stiffness: 1000,
        // damping: 500,
        // mass: 3,
        // overshootClamping: true,
        // restDisplacementThreshold: 0.01,
        // restSpeedThreshold: 0.01,
        duration: 300,
        // easing: 1000,
    },
};

const MyTransition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        // open: TransitionSpecs.TransitionIOSSpec,
        // close: TransitionSpecs.TransitionIOSSpec,
        open: config,
        close: config,
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({current, next, layouts}) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                        }),
                        /*translateY: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.height, 0],
                        }),*/
                    },
                    /*{
                        rotate: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0],
                        }),
                    },*/
                    {
                        scale: next
                            ? next.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            })
                            : 1,
                    },
                ],
            },
            overlayStyle: {
                opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                }),
            },
        };
    },
};

const Stack = createStackNavigator();

function FeedNav(props) {
    const appSettingsState = useAppSettingsState();
    const {app_settings} = appSettingsState.config;

    return (
        <Stack.Navigator initialRouteName="FeedList" mode={'card'} headerMode={'screen'}>
            {app_settings.chat ? <Stack.Screen
                    name="FeedList"
                    component={FeedList}
                    options={{
                        title: 'Activity Feed',
                        // headerTitle: props => <LogoTitle {...props} />,
                        header: ({scene, previous, navigation}) => {
                            const {options} = scene.descriptor;
                            const title =
                                options.headerTitle !== undefined
                                    ? options.headerTitle
                                    : options.title !== undefined
                                    ? options.title
                                    : scene.route.name;
                            return (
                                <FeedListHeader
                                    title={title}
                                    onClick={() => {
                                        props.navigation.navigate('ChatNav');
                                    }
                                    }
                                />
                            );
                        },
                        /*headerRight: () => (
                            <TouchableOpacity
                                style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => alert('This is a button!')}
                            >
                                <Button
                                    icon={
                                        <Icon
                                            type={'font-awesome'}
                                            name="sign-out"
                                            size={18}
                                            color="rgb(101,102,103)"
                                            containerStyle={{padding: 10}}
                                        />
                                    }
                                    type={'clear'}
                                    iconRight={true}
                                    title="Signout"
                                    titleStyle={{color: 'rgb(101,102,103)'}}
                                    // onPress={onSignOut}
                                />
                            </TouchableOpacity>
                        ),*/
                    }}
                />
                :
                <Stack.Screen
                    name="FeedList"
                    component={FeedList}
                    options={{
                        title: 'Activity Feed',
                        header: ({scene, previous, navigation}) => {
                            const {options} = scene.descriptor;
                            const title =
                                options.headerTitle !== undefined
                                    ? options.headerTitle
                                    : options.title !== undefined
                                    ? options.title
                                    : scene.route.name;
                            return (
                                <NavigationHeader title={title}/>
                            );
                        },
                    }}
                />}
            <Stack.Screen
                name="DetailsNav"
                component={DetailsNav}
                options={{
                    title: 'Feed Details',
                    headerShown: false,
                    ...MyTransition,
                    // ...forSlide
                    // headerStyleInterpolator: forSlide
                }}
            />
            <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{
                    title: 'User Profile',
                }}
            />
        </Stack.Navigator>
    );
}

export default FeedNav;
