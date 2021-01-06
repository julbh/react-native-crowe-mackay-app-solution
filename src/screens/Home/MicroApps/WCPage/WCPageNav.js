import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CategoryScreen from './CategoryScreen';
import ProductsScreen from './ProductsScreen';
// import {globalStyle} from '../../../../assets/style';
import ProductScreen from './ProductScreen';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

const Stack = createStackNavigator();

function WCPageNav(props) {
    const {config} = useAppSettingsState();
    const globalStyle = {...config.style};

    return (
        <Stack.Navigator
            initialRouteName="CategoryScreen" mode={'card'} headerMode={'screen'}
        >
            <Stack.Screen
                name="CategoryScreen"
                component={CategoryScreen}
                options={{
                    title: 'All Categories',
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
                name="ProductsScreen"
                component={ProductsScreen}
                options={{
                    title: 'Products',
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
                name="ProductScreen"
                component={ProductScreen}
                options={{
                    title: 'Product',
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
            {/*<Stack.Screen
                name="CategoryScreen"
                component={CategoryScreen()}
                options={({route}) => (
                    {
                        title: 'All Categories',
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
            />*/}
        </Stack.Navigator>
    );
}

export default WCPageNav;
