import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {Avatar, Badge, Icon} from "react-native-elements";
import {useSelector} from "react-redux";
import {useAppSettingsState} from "../context/AppSettingsContext";

function TabIcon({route, isFocused}) {
    let inboxData = useSelector((rootReducer) => rootReducer.inboxData);
    const {config} = useAppSettingsState();
    const {app_settings} = config;
    const globalStyle = {
        ...config.style
    };

    // const color = isFocused ? globalStyle.black : globalStyle.gray_tone_3;
    const color = globalStyle.black;
    const size = isFocused ? 33 : 25;

    console.log('route ===> ', route)
    if (route.name === 'FeedNav') {
        return <Icon type={'font-awesome'} name="newspaper-o" color={color} size={size}/>
    } else if (route.name === 'MicroAppNav') {
        return <Icon type={'MaterialCommunity'} name="apps" color={color} size={size}/>
    } else if (route.name === 'InboxNav') {
        return <>
            <Icon type={'material-community'} name="email-outline" color={color} size={size}/>
            {inboxData.data?.length > 0 && inboxData.data?.filter(inbox => inbox.data.status === 'UNREAD').length > 0 &&
            <Badge
                status="error"
                value={inboxData.data?.filter(inbox => inbox.data.status === 'UNREAD').length}
                containerStyle={{position: 'absolute', top: 0, right: 26}}
            />}
        </>
    } else if (route.name === 'ProfileNav') {
        return <Icon type={'font-awesome'} name="user-circle" color={color} size={size}/>
    } else {
        return <Avatar
            size={size}
            source={{uri: route.params?.params?.icon}}
            imageProps={{resizeMode: 'contain'}}
            // overlayContainerStyle={{backgroundColor: 'blue'}}
        />
    }
}

export function CustomTabBar(props) {
    let {state, descriptors, navigation} = props;
    // console.log('tab bar props ====> ', props);

    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    return (
        <View style={{flexDirection: 'row'}}>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const MyIcon = options.tabBarIcon;

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? {selected: true} : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        activeOpacity={0.8}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopColor: 'lightgrey',
                            borderTopWidth: 0.5,

                            // shadowColor: "#000",
                            // shadowOffset: {
                            //     width: 0,
                            //     height: 18,
                            // },
                            // shadowOpacity: 0.6,
                            // shadowRadius: 11.14,
                            // elevation: 17,

                            backgroundColor: '#fff',
                            // backgroundColor: isFocused ? '#CCCCCC' : '#fff',
                            ...props.style,
                        }}
                    >
                        <MyIcon focused={isFocused} color={'#000'} size={25}/>
                        {/*<TabIcon route={route} isFocused={isFocused}/>*/}
                        {/*<Text style={{color: isFocused ? '#673ab7' : '#222'}}>
                            {label}
                        </Text>*/}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
