import React, {useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DatabaseList from './DatabaseList';
// import {globalStyle} from '../../../../../assets/style';
import DatabaseDetails from './DatabaseDetails';
import NavigationHeader from '../../../../../components/NavigationHeader';
import ObjectDetails from './ObjectDetails';
import ObjectDetailsHeader from '../../components/ObjectDetailsHeader';
import {Menu, MenuOption, MenuOptions, MenuTrigger, renderers} from 'react-native-popup-menu';
import {Icon} from 'react-native-elements';
import {Alert, Platform, Text, View} from 'react-native';
import URI from 'urijs';
import {dynamicDelete} from '../../../../../services/microApps';
import {useDispatch} from 'react-redux';
import * as Actions from '../../../../../redux/actions';
import { Paragraph, Dialog, Portal } from 'react-native-paper';
import Comments from './Comments/Comments';
import EditComment from './Comments/EditComment';
import CommentDetails from './Comments/CommentDetails';
import BackHeader from '../../../../../components/BackHeader';
import DeeplinkDetailsHeader from '../../components/DeeplinkDetailsHeader';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

const Stack = createStackNavigator();

export default function DatabaseNav({navigation, route}) {
    const {config} = useAppSettingsState();
    const globalStyle = {...config.style};

    const dispatch = useDispatch();

    const onMenu = (value, r, nav) => {
        if (value === 2) {
            Alert.alert(
                'Please confirm!',
                'Are you sure delete this item?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => onOK()},
                ],
                {cancelable: false},
            );

            const onOK = () => {
                let url = route?.params?.params?.payload.path;
                let id = r?.params?.item._id;
                if (Boolean(url) && Boolean(id)) {
                    dispatch(Actions.setAppLoadingAction(true));
                    dynamicDelete(`${url.split('?')[0]}/${id}`).then(res => {
                        dispatch(Actions.setAppLoadingAction(false));
                        dispatch(Actions.getDBListAction(url));
                        nav.goBack();
                    }).catch(err => {
                        dispatch(Actions.setAppLoadingAction(false));
                    });
                }
            };


        } else if (value === 1) {
            console.log(r?.params?.item)
            let id = r?.params?.item._id;
            nav.navigate('Comments', {
                reference_id: id,
                item: r?.params?.item
            });
        }
    };

    return (
        <Stack.Navigator initialRouteName={'DatabaseList'}>
            <Stack.Screen
                name="DatabaseList"
                component={DatabaseList}
                options={({route}) => (
                    {
                        title: route.params.navTitle,
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
                name="DatabaseDetails"
                component={DatabaseDetails}
                options={({route, navigation}) => ({
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
                    headerRight: () => (
                        <Menu onSelect={value => onMenu(value, route, navigation)}
                              renderer={renderers.Popover}
                              rendererProps={
                                  {
                                      placement: 'bottom',
                                      anchorStyle: {
                                          width: 0, height: 0,
                                      },
                                  }
                              }
                        >
                            <MenuTrigger customStyles={trigerStyles}>
                                <Icon
                                    type={'material-community'}
                                    name="dots-vertical"
                                    size={24}
                                    color={globalStyle?.primary_color_2}
                                    containerStyle={{padding: Platform.OS === 'android' ? 10 : 0}}
                                />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption value={1} text='Comment' customStyles={optionStyles}/>
                                <MenuOption value={2} text='Delete' customStyles={optionStyles}/>
                            </MenuOptions>
                        </Menu>
                    ),
                })}
            />
            <Stack.Screen
                name="ObjectDetails"
                component={ObjectDetails}
                options={({route}) => (
                    {
                        title: 'Details',
                        header: ({scene, previous, navigation}) => {
                            const {options} = scene.descriptor;
                            const title =
                                options.headerTitle !== undefined
                                    ? options.headerTitle
                                    : options.title !== undefined
                                    ? options.title
                                    : scene.route.name;
                            return (
                                <ObjectDetailsHeader navigation={navigation}/>
                                // route.params === undefined || route.params.navTitle === "MicroApp" ? <NavigationHeader title={title}/> : <BackHeader/>
                            );
                        },
                    }
                )}
            />
            <Stack.Screen
                name="Comments"
                component={Comments}
                options={({route}) => (
                    {
                        title: 'Comments',
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
                        header: ({scene, previous, navigation}) => {
                            const {options} = scene.descriptor;
                            const title =
                                options.headerTitle !== undefined
                                    ? options.headerTitle
                                    : options.title !== undefined
                                    ? options.title
                                    : scene.route.name;
                            return (
                                route.params?.type === 'deeplink'  ? <DeeplinkDetailsHeader title={title} navigation={navigation}/> : <BackHeader title={title} goBack={() => navigation.goBack()}/>
                                // route.params === undefined || route.params.navTitle === "MicroApp" ? <NavigationHeader title={title}/> : <BackHeader/>
                            );
                        },
                    }
                )}
            />
            <Stack.Screen
                name="CommentDetails"
                component={CommentDetails}
                options={({route}) => (
                    {
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
                    }
                )}
            />
            <Stack.Screen
                name="EditComment"
                component={EditComment}
                options={({route}) => (
                    {
                        title: route?.params?.action === 'new' ? 'New Comment' : 'Edit Comment',
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
        </Stack.Navigator>
    );
};

const optionsStyles = {
    optionsContainer: {
        padding: 5,
    },
    optionsWrapper: {},
    optionWrapper: {
        margin: 5,

    },
    optionTouchable: {
        underlayColor: 'gold',
        activeOpacity: 70,
    },
    optionText: {
        // color: 'brown',
    },
};

const trigerStyles = {
    triggerOuterWrapper: {
        padding: 5,
        borderRadius: 60,
    },
    triggerWrapper: {
        borderRadius: 60,
    },
};

const optionStyles = {
    optionText: {
        fontSize: 16,
    },
};
