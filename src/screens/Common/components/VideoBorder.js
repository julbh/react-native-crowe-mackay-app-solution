import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useAppSettingsState} from "../../../context/AppSettingsContext";

export default function VideoBorder(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    return (
        <View
            style={[styles.container, props.position === 'bottom' && styles.bottom]}
        />
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: 30,
            backgroundColor: '#000',
        },
        bottom: {
            bottom: 0,
        },
    })
};
