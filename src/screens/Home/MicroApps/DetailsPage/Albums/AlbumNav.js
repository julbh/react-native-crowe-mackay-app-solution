import React, { useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Button,
    Icon,
} from 'react-native-elements';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
// import { globalStyle } from '../../../../../assets/style';
import AlbumList from './AlbumList';
import AlbumDetails from './AlbumDetails';
import MyLibrary from './MyLibrary';
import AlbumHistory from './AlbumHistory';
import { Platform } from 'react-native';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

const Stack = createStackNavigator();

export default function AlbumNav({ navigation }) {
    const {config} = useAppSettingsState();
    const globalStyle = {...config.style};

    const onMenu = (value) => {
        if (value === 1) {
            navigation.navigate('MyLibrary');
        } else if (value === 2) {
            navigation.navigate('AlbumHistory');
        }
    };

    return (
        <Stack.Navigator initialRouteName={'FeedDetails'}>
            <Stack.Screen
                name="AlbumList"
                component={AlbumList}
                options={{
                    title: 'Albums',
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
                    headerRight: () => (
                        <Menu onSelect={value => onMenu(value)}
                            renderer={renderers.Popover}
                            rendererProps={
                                {
                                    placement: 'bottom',
                                    anchorStyle: {
                                        width: 0, height: 0
                                    }
                                }
                            }
                        >
                            <MenuTrigger customStyles={trigerStyles}>
                                <Icon
                                    type={'material-community'}
                                    name="dots-vertical"
                                    size={24}
                                    color={globalStyle.primary_color_2}
                                    containerStyle={{ padding: Platform.OS === 'android' ? 10 : 0 }}
                                />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption value={1} text='Downloaded' customStyles={optionStyles} />
                                <MenuOption value={2} text='History' customStyles={optionStyles} />
                            </MenuOptions>
                        </Menu>
                    ),
                }}
            />
            <Stack.Screen
                name="AlbumDetails"
                component={AlbumDetails}
                options={{
                    title: 'Details',
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
                name="MyLibrary"
                component={MyLibrary}
                options={{
                    title: 'Downloaded',
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
                name="AlbumHistory"
                component={AlbumHistory}
                options={{
                    title: 'History',
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
        </Stack.Navigator>
    );
};

const optionsStyles = {
    optionsContainer: {
        padding: 5,
    },
    optionsWrapper: {
    },
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
    }
};

const optionStyles = {
    optionText: {
        fontSize: 16,
    }
};
