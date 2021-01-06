import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {unsubscribe} from '../../../services/notification';
import NavigationHeader from '../../../components/NavigationHeader';
import InboxScreen from './InboxScreen';

const Stack = createStackNavigator();

function InboxNav() {

    return (
        <Stack.Navigator
            initialRouteName="ProfileScreen"
        >
            <Stack.Screen
                name="InboxScreen"
                component={InboxScreen}
                options={{
                    title: "Inbox",
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
            {/*<Stack.Screen
                name="Settings"
                component={ProfileSettings}
                options={{
                    title: "Settings",
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
                                        containerStyle={{padding: 10}}
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
                }}/>*/}
        </Stack.Navigator>
    );
}

export default InboxNav;
