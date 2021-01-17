import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ListClass from './ListClass';
import ListClassDetails from './ListClassDetails';
import {useAppSettingsState} from '../../../../../context/AppSettingsContext';

const Stack = createStackNavigator();

function ListClassNav(props) {
    const {config} = useAppSettingsState();
    const globalStyle = {...config.style};

    return (
        <Stack.Navigator
            initialRouteName="CategoryScreen" mode={'card'} headerMode={'screen'}
        >
            <Stack.Screen
                name="ListClassDetails"
                component={ListClassDetails}
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
                name="ListClassScreen"
                component={ListClass}
                options={{
                    title: 'List',
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
        </Stack.Navigator>
    );
}

export default ListClassNav;
