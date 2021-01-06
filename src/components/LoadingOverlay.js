import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import Spinner from "react-native-spinkit";
// import {globalStyle} from '../assets/style';
import {useAppSettingsState} from "../context/AppSettingsContext";

function LoadingOverlay() {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    return (
        <View style={styles.loadingContainer}>
            <Spinner
                style={styles.spinner}
                isVisible={true}
                size={100}
                type={'FadingCircleAlt'}
                color={globalStyle?.primary_color_2}
            />
            <View style={styles.textContainer}>
                <Text style={styles.text}>Wait ...</Text>
            </View>
        </View>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        loadingContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff0',
            zIndex: 30,
        },
        textContainer: {
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center'
        },
        text: {
            color: globalStyle.primary_color_2,
        }
    })
};

export default LoadingOverlay;
