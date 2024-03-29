import React, {useContext, useEffect, useRef, useState} from 'react';
import {Badge, Button, Icon, Text} from 'react-native-elements';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
// import {globalStyle} from '../../../../assets/style';
import BackButton from '../../../../components/BackButton';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

function ChatListHeader({
                            title,
                            goBack,
                            openNew,
                        }) {

    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    return (
        <>
            <View style={styles.container}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        left: 0,
                    }}
                >
                    <BackButton goBack={goBack}/>
                </View>
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
                onPress={openNew}
            >
                <Icon
                    type={'font-awesome'}
                    name="edit"
                    size={32}
                    color={globalStyle?.gray_tone_1}
                    containerStyle={{padding: 10}}
                />
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

export default ChatListHeader;
