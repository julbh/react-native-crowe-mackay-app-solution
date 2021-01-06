import React, {useContext, useEffect, useRef, useState} from 'react';
import {Text} from 'react-native-elements';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useAppSettingsState} from "../context/AppSettingsContext";

function NavigationHeader({title}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 2,
            backgroundColor: globalStyle.common_header_color,
            borderBottomColor: globalStyle.gray_tone_3,
        },
        text: {
            fontSize: 20,
            fontWeight: 'bold',
            color: globalStyle.primary_color_2,
        },
    })
};

export default NavigationHeader;
