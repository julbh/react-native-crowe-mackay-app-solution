import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Button, Icon, Text} from 'react-native-elements';
import {TouchableOpacity, StyleSheet, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import Toast from 'react-native-simple-toast';
import ProfileScreen from './ProfileScreen';
import ProfileSettings from './ProfileSettings';
import {unsubscribeAll} from '../../../services/notification';
import {AuthContext, pusher} from '../../../../App';
import NavigationHeader from '../../../components/NavigationHeader';
import {useAppSettingsState} from "../../../context/AppSettingsContext";

const Stack = createStackNavigator();

function ProfileNav(props) {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const {signOut} = useContext(AuthContext);

    const onSignOut = async () => {

            try {
                let id_token = await AsyncStorage.getItem('id_token');
                let user_id = auth_strategy ? "" : (jwtDecode(id_token)).user_id;
                // unsubscribe('debug-' + user_id);
                unsubscribeAll(user_id);
                /*await AsyncStorage.multiRemove([
                    'access_token',
                    'refresh_token',
                    'id_token',
                ]);*/
                await AsyncStorage.clear();
                pusher.allChannels().forEach(channel => {
                    channel.unbind_all();
                    pusher.unsubscribe(channel);
                    console.log(channel.name)
                });
                /*if (auth_strategy) {
                    props.navigation.navigate('Auth')
                } else {
                    signOut();
                }*/
                signOut();
                Toast.showWithGravity('Logout Successfully!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            } catch (err) {
                console.log(err);
            }
    };

    return (
        <Stack.Navigator
            initialRouteName="ProfileScreen"
        >
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    title: "Profile",
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
                            <NavigationHeader title={title}/>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="Settings"
                component={ProfileSettings}
                options={{
                    title: "Settings",
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
                    // headerTitle: props => <LogoTitle {...props} />,
                    headerRight: () => (
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
                                        containerStyle={styles.logoutBtnContainer}
                                    />
                                }
                                type={'clear'}
                                iconRight={true}
                                title="Signout"
                                titleStyle={{color: 'rgb(101,102,103)'}}
                                onPress={onSignOut}
                            />
                        </TouchableOpacity>
                    ),
                }}/>
        </Stack.Navigator>
    );
}

export default ProfileNav;

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        logoutBtnContainer: {
            padding: Platform.OS === 'android' ? 10 : 0,
            marginHorizontal: 5
        }
    })
};
