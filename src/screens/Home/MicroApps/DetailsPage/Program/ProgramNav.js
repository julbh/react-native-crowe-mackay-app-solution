import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Text, TouchableOpacity, View} from 'react-native';
import ProgramScreen from './ProgramScreen';
import ProgramDetails from './ProgramDetails';
import UserProfile from './UserProfile';
import NavigationHeader from '../../../../../components/NavigationHeader';
import FeedbackScreen from './FeedbackScreen';
import {Button, Icon} from 'react-native-elements';
// import {globalStyle} from '../../../../../assets/style';
import {AppSettingsStateContext} from "../../../../../context/AppSettingsContext";

const Stack = createStackNavigator();

class ProgramNav extends React.Component {
    static contextType = AppSettingsStateContext;

    constructor(props) {
        super(props);

        this.state = {
            firstLaunch: null,
            condUpdate: null,
            globalStyle: {},
        };
    }

    componentDidMount() {
        const globalStyle = this.context.config.style;
        this.setState({globalStyle: globalStyle});
    }

    render() {
        let {globalStyle} = this.state;

        return (
            <Stack.Navigator initialRouteName="ProgramScreen">
                <Stack.Screen
                    name="ProgramScreen"
                    component={ProgramScreen}
                    options={(props) => {
                        console.log('program screen props ==> ', props)
                        return (
                            {
                                title: props.route.params?.navTitle ? props.route.params?.navTitle : props.tabData?.navTitle,
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
                        )
                    }
                    }
                    /* options={{
                        title: 'Program',
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
                    }} */
                />
                <Stack.Screen
                    name="ProgramDetails"
                    component={ProgramDetails}
                    options={{
                        title: 'Program Details',
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
                        /*headerLeft: () => (
                            <Button
                                icon={
                                    <Icon
                                        type={'ionicon'}
                                        name="arrow-back-outline"
                                        size={24}
                                        color="#000"
                                        containerStyle={{padding: 10}}
                                    />
                                }
                                type={'clear'}
                                iconRight={true}
                                title=""
                                containerStyle={{borderRadius: 30}}
                                titleStyle={{color: 'rgb(101,102,103)'}}
                                onPress={() => this.props.navigation.navigate('Agenda', {
                                    screen: 'Program',
                                    params: {id: null},
                                })}
                            />
                            // </TouchableOpacity>
                        ),*/
                    }}
                />
                <Stack.Screen
                    name="FeedbackScreen"
                    component={FeedbackScreen}
                    options={{
                        title: 'Feedback',
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
                    }}
                />
                <Stack.Screen
                    name="UserProfilePro"
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
                    }}
                />
            </Stack.Navigator>
        )
            ;
    }
}

export default ProgramNav;
