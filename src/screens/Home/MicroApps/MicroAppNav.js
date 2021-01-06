import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// import {globalStyle} from '../../../assets/style';
import NavigationHeader from '../../../components/NavigationHeader';
import MicroAppScreen from './MicroAppScreen';
import WebDetails from './DetailsPage/WebDetails';
import ContactList from './DetailsPage/ContactList';
import FormScreen from './DetailsPage/FormScreen';
import MicroAppHeader from './components/MicroAppHeader';
import ProgramNav from './DetailsPage/Program/ProgramNav';
import UserProfile from './DetailsPage/UserProfile';
import { Platform } from 'react-native';
import AlbumNav from './DetailsPage/Albums/AlbumNav';
import DatabaseNav from './DetailsPage/Database/DatabaseNav';
import WCPageNav from './WCPage/WCPageNav';
import {useAppSettingsState} from "../../../context/AppSettingsContext";

const Stack = createStackNavigator();

function MicroAppNav(props) {
    const {config} = useAppSettingsState();
    const globalStyle = {...config.style};

    useEffect(() => {
        let params = props.userData;
        console.log(params);
    }, []);

    return (
        <Stack.Navigator
            initialRouteName="MicroApp"  mode={'card'} headerMode={'screen'}
        >
            <Stack.Screen
                name="MicroApp"
                component={MicroAppScreen}
                options={({route}) => (
                    {
                        title: 'Micro Apps',
                        header: ({scene, previous, navigation}) => {
                            const {options} = scene.descriptor;
                            const title =
                                options.headerTitle !== undefined
                                    ? options.headerTitle
                                    : options.title !== undefined
                                    ? options.title
                                    : scene.route.name;
                            return (
                                route.params === undefined || route.params.navTitle === "MicroApp" ? <NavigationHeader title={title}/> : <MicroAppHeader/>
                            );
                        },
                    }
                )}
            />
            <Stack.Screen
                name="WebDetails"
                component={WebDetails}
                options={{
                    title: 'Details',
                    headerStyle: {
                        backgroundColor: '#F2F2F2',
                        height: 50,
                        borderBottomColor: globalStyle?.gray_tone_3,
                    },
                    headerTintColor: globalStyle?.primary_color_2,
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: globalStyle?.primary_color_2,
                    },
                }}/>
            <Stack.Screen
                name="ContactList"
                component={ContactList}
                options={{
                    title: 'Contact List',
                    headerStyle: {
                        backgroundColor: '#F2F2F2',
                        height: 50,
                        borderBottomColor: globalStyle?.gray_tone_3,
                    },
                    headerTintColor: globalStyle?.primary_color_2,
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: globalStyle?.primary_color_2,
                    },
                }}/>
            <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{
                    title: 'User Profile',
                    headerStyle: {
                        backgroundColor: '#F2F2F2',
                        height: 50,
                        borderBottomColor: globalStyle?.gray_tone_3,
                    },
                    headerTintColor: globalStyle?.primary_color_2,
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: globalStyle?.primary_color_2,
                    },
                }}/>
            <Stack.Screen
                name="FormScreen"
                component={FormScreen}
                options={({route}) => (
                    {
                        // title: route.params.navTitle,
                        title: Platform.OS !== 'android' ? '' : route.params.navTitle,
                        headerStyle: {
                            backgroundColor: '#F2F2F2',
                            height: 50,
                            borderBottomColor: globalStyle?.gray_tone_3,
                        },
                        headerTintColor: globalStyle?.primary_color_2,
                        headerTitleStyle: {
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: globalStyle?.primary_color_2,
                        },
                    }
                )}
            />
            <Stack.Screen
                name="ProgramNav"
                component={ProgramNav}
                options={{
                    title: "Program",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="AlbumNav"
                component={AlbumNav}
                options={{
                    title: "Albums",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DatabaseNav"
                component={DatabaseNav}
                options={{
                    title: "Database",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="WCPageNav"
                component={WCPageNav}
                options={{
                    title: "WCPageNav",
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

export default MicroAppNav;
