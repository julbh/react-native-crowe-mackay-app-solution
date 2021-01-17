import React, {useContext, useEffect, useRef, useState} from 'react';
import {Badge, Button, Icon, Text} from 'react-native-elements';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
// import {globalStyle} from '../../../../assets/style';
import {useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

function FeedListHeader({title, onClick}) {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const chatHistoryData = useSelector(({chatHistoryData}) => chatHistoryData);
    const userData = useSelector(({userData}) => userData);

    useEffect(() => {
        // let curUser = (jwtDecode(userData.id_token));
    }, []);

    const countUnread = () => {
        if(chatHistoryData.data !== undefined){
            // let curUser = (jwtDecode(userData.id_token));
            let curUser = auth_strategy ? {} : (jwtDecode(userData.id_token));
            return chatHistoryData.data.filter(item => {
                    // console.log('countUnread ====> ', item.data);
                    return Boolean(item.data.channel_payload.read) && !Boolean(item.data.channel_payload.read[curUser.user_id]);
                },
            ).length;
        }
        return 0;
    };

    let unread = countUnread();

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: 5,
                }}
                onPress={onClick}
            >
                <Icon
                    type={'entypo'}
                    name="chat"
                    size={32}
                    color={globalStyle?.gray_tone_1}
                    containerStyle={{padding: 10}}
                />
                {unread > 0 && <Badge
                    status="error"
                    value={unread}
                    containerStyle={{position: 'absolute', top: 4, right: 4}}
                />}
            </TouchableOpacity>
        </>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 2,
            backgroundColor: globalStyle?.common_header_color,
            borderBottomColor: globalStyle?.gray_tone_3,
        },
        text: {
            fontSize: 20,
            fontWeight: 'bold',
            color: globalStyle?.primary_color_2,
        },
    })
};

export default FeedListHeader;
