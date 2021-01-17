import React, {useEffect} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FeedNav from '../screens/Home/Feed/FeedNav';
import {bindActionCreators} from 'redux';
import {connect, useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import ProfileNav from '../screens/Home/Profile/ProfileNav';
import MicroAppNav from '../screens/Home/MicroApps/MicroAppNav';
import {Avatar, Badge, Icon} from 'react-native-elements';
import * as Actions from '../redux/actions';
import InboxNav from '../screens/Home/Inbox/InboxNav';
import {init} from '../services/notification';
import URI from 'urijs';
// import {globalStyle} from '../assets/style';
import {useAppSettingsState} from "../context/AppSettingsContext";
import ProgramNav from "../screens/Home/MicroApps/DetailsPage/Program/ProgramNav";
import NavigationHeader from "../components/NavigationHeader";
import WebDetails from "../screens/Home/MicroApps/DetailsPage/WebDetails";
import ContactList from "../screens/Home/MicroApps/DetailsPage/ContactList";
import FormScreen from "../screens/Home/MicroApps/DetailsPage/FormScreen";
import AlbumNav from "../screens/Home/MicroApps/DetailsPage/Albums/AlbumNav";
import DatabaseNav from "../screens/Home/MicroApps/DetailsPage/Database/DatabaseNav";
import WCPageNav from "../screens/Home/MicroApps/WCPage/WCPageNav";
import {CustomTabBar} from "../components/CustomTabBar";

const Tab = createBottomTabNavigator();

const FeedScreenBase = () => {
    return (
        <React.Fragment style={{paddingBottom: 100}}>
            <FeedNav/>
        </React.Fragment>
    );
};

const HomeNavigator = (props) => {
    const {config} = useAppSettingsState();
    const {app_settings} = config;
    // console.log('app_settings @@@@@@@@@@ ', app_settings)

    const globalStyle = {
        ...config.style
    };

    const dispatch = useDispatch();
    const dialogState = useSelector(({dialogState}) => dialogState);

    useEffect(() => {
        let user_id = '';
        AsyncStorage.getItem('id_token')
            .then((response) => {
                user_id = (jwtDecode(response)).user_id;
                init(user_id, dispatch);
            })
            .catch(err => {
                console.log(err);
                init(null);
            });
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                if (url) {
                    navigate(url);
                    // Linking.addEventListener('url', handleOpenURL);
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            Linking.addEventListener('url', handleOpenURL);
        }

        return () => {
            Linking.removeEventListener('url', handleOpenURL);
        };
    }, []);

    useEffect(() => {
        props.getInbox();
    }, []);

    const handleOpenURL = (event) => {
        props.navigation.navigate(event.url);
    };

    const navigate = (url) => {
        const {navigate} = props.navigation;

        // console.log('************** ', url)

        let routeURI = URI(url);

        let routeName = routeURI.hostname();
        let id = routeURI.segment(0);

        // console.log('deeplink uri ===> ', url, routeURI, routeName, id);

        /*const route = url?.replace(/.*?:\/\//g, '');
        const id = route?.match(/\/([^\/]+)\/?$/)[1];
        const routeName = route?.split('/')[0];*/

        if (routeName === 'webview') {
            let query = routeURI.query(true)?.url;
            navigate('WebViewScreen', {
                query,
            });
        } else if (routeName === 'feed') {
            navigate('FeedNav', {screen: 'FeedList', params: {id: id}});
        } else if (routeName === 'agenda') {
            navigate('MicroAppNav', {screen: 'ProgramNav', params: {screen: 'ProgramScreen', params: {id: id}}});
        } else if (routeName === 'chat') {
            navigate('FeedNav', {
                screen: 'FeedList',
                params: {id, type: 'chat'},
            });
        }
    };

    function makeChild(tab_data) {
        // console.log('tab_data ===> ', tab_data)
        let tabData = {
            ...tab_data.data,
            navTitle: tab_data.data.title,
        };
        if (tab_data.data.class === 'AGENDA') {
            return (
                <ProgramNav tabData={tabData} customTab={true}/>
            )
        } else if (tab_data.data.class === 'WEB') {
            return (
                <WebDetails tabData={tabData} customTab={true}/>
            )
        } else if (tab_data.data.class === 'CONTACT_LIST') {
            return (
                <ContactList tabData={tabData} customTab={true}/>
            )
        } else if (tab_data.data.class === 'FORM') {
            return (
                <FormScreen tabData={tabData} customTab={true}/>
            )
        } else if (tab_data.data.class === 'ALBUM_LIST') {
            return (
                <AlbumNav tabData={tabData} customTab={true}/>
            )
        } else if (tab_data.data.class === 'DATABASE') {
            return (
                <DatabaseNav tabData={tabData} customTab={true}/>
            )
        } else if (tab_data.data.class === 'WOOCOMMERCE') {
            return (
                <WCPageNav tabData={tabData} customTab={true}/>
            )
        }
    }

    function onCustomTabClick(e, tab) {
        // Prevent default action
        e.preventDefault();
        let item = tab.data;
        if (item.class === 'WEB') {
            props.navigation.navigate({name: tab.data.title, params: item});
        } else if (item.class === 'CONTACT_LIST') {
            props.navigation.navigate({name: tab.data.title});
        } else if (item.class === 'FORM') {
            props.navigation.navigate({name: tab.data.title, params: {...item, navTitle: item.title}});
        } else if (item.class === 'AGENDA') {
            // props.navigation.navigate({name: 'Agenda', params: item});
            props.navigation.navigate(tab.data.title, {
                screen: 'ProgramScreen',
                params: {...item, navTitle: item.title}
            });
        } else if (item.class === 'ALBUM_LIST') {
            // props.navigation.navigate({name: 'Agenda', params: item});
            props.navigation.navigate(tab.data.title, {screen: 'AlbumList', params: {...item, navTitle: item.title}});
        } else if (item.class === 'DATABASE') {
            // props.navigation.navigate({name: 'Agenda', params: item});
            // console.log('go to database list ==> ', item);
            props.navigation.navigate(tab.data.title, {
                screen: 'DatabaseList',
                params: {...item, navTitle: item.title}
            });
        } else if (tab_data.data.class === 'WOOCOMMERCE') {
            props.navigation.navigate(tab.data.title,
                {
                    screen: 'CategoryScreen',
                    params: {item},
                },
            );
        }
        /*props.navigation.navigate(tab.data.title, {
            screen: 'ProgramScreen',
            params: {...tab.data, navTitle: tab.data.title}
        })*/
    }

    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            initialRouteName="Feed"
            tabBarOptions={{
                activeTintColor: globalStyle.black,
                inactiveTintColor: globalStyle.gray_tone_3,
                showLabel: false,
                tabBarColor: '#222f3e',
                style: {
                    height: globalStyle.miniBarMargin,
                    marginTop: dialogState.state === 1 ? globalStyle.miniBarHeight : 0,
                },
                tabStyle: {
                    // height: 50,
                    // backgroundColor: '#fff',
                },
            }}
            animationEnabled={true}
            swipeEnabled={true}
            shifting={true}
        >
            {app_settings?.feed && <Tab.Screen
                name="FeedNav"
                component={FeedNav}
                options={{
                    tabBarLabel: 'Feed',
                    tabBarIcon: ({color, size, focused}) => (
                        <Icon type={'font-awesome'}
                              name="newspaper-o"
                              color={color}
                              style={{opacity: focused ? 1 : 0.5}}
                              size={focused ? 33 : 25}/>
                    ),
                    tabBarColor: globalStyle.gray_tone_3,
                }}
            />}
            {
                app_settings.microapp_tabs?.length > 0 &&
                app_settings.microapp_tabs?.map((tab, index) => {
                    return (
                        <Tab.Screen
                            key={index}
                            name={tab.data.title}
                            params={tab}
                            children={() => makeChild(tab)}
                            listeners={{
                                tabPress: e => onCustomTabClick(e, tab),
                            }}
                            options={{
                                title: tab.data.title,
                                tabBarLabel: tab.data.title,
                                tabBarIcon: ({color, size, focused}) => (
                                    <Avatar
                                        containerStyle={{opacity: focused ? 1 : 0.2}}
                                        source={{uri: tab.data.icon}}
                                        imageProps={{resizeMode: 'contain'}}
                                        size={focused ? 33 : 25}
                                    />
                                    // <Icon type={'MaterialCommunity'} name="apps" color={color} size={25}/>
                                ),
                            }}
                        />
                    )
                })
            }
            {app_settings?.microapp && <Tab.Screen
                name="MicroAppNav"
                component={MicroAppNav}
                options={{
                    title: 'Micro Apps',
                    tabBarLabel: 'Micro Apps',
                    tabBarIcon: ({color, size, focused}) => (
                        <Icon type={'MaterialCommunity'}
                              style={{opacity: focused ? 1 : 0.5}}
                              name="apps"
                              color={color}
                              size={focused ? 33 : 25}/>
                    ),
                    tabBarColor: globalStyle.gray_tone_3,
                }}
            />}
            {app_settings?.inbox && <Tab.Screen
                name="InboxNav"
                component={InboxNav}
                options={{
                    title: 'Inbox',
                    tabBarLabel: 'Inbox',
                    tabBarIcon: ({color, size, focused}) => (
                        <>
                            <Icon type={'material-community'}
                                  style={{opacity: focused ? 1 : 0.5}}
                                  name="email-outline" color={color}
                                  size={focused ? 33 : 25}/>
                            {props.inboxData.data.length > 0 && props.inboxData.data.filter(inbox => inbox.data.status === 'UNREAD').length > 0 &&
                            <Badge
                                status="error"
                                value={props.inboxData.data.filter(inbox => inbox.data.status === 'UNREAD').length}
                                containerStyle={{position: 'absolute', top: 0, right: 26}}
                            />}
                        </>
                    ),
                    tabBarColor: globalStyle.gray_tone_3,
                }}
            />}
            <Tab.Screen
                name="ProfileNav"
                component={ProfileNav}
                options={{
                    title: 'Profile',
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({color, size, focused}) => {
                        // console.log('tabBarIcon ======> ', color, size, focused)
                        return (
                            <Icon
                                style={{opacity: focused ? 1 : 0.5}}
                                type={'font-awesome'}
                                name="user-circle"
                                color={color}
                                size={focused ? 33 : 25}/>
                        )
                    },
                    tabBarColor: globalStyle.gray_tone_3,
                }}
            />
        </Tab.Navigator>
    );
};


const mapStateToProps = state => ({
    feedData: state.feedData.feed,
    settingsData: state.settingsData,
    inboxData: state.inboxData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getFeed: Actions.getFeedAction,
    getSettings: Actions.getSettingsAction,
    getInbox: Actions.getInboxAction,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomeNavigator);
