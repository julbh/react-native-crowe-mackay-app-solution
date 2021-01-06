import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {globalStyle} from '../../assets/style';
import {useAppSettingsState} from "../../context/AppSettingsContext";

export default function MainContainer(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    return (
        <SafeAreaView style={[styles.container, props.style]}>
            {props.children}
        </SafeAreaView>
    )
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: globalStyle.white,
        }
    })
};
/*

const useStyles = (globalStyle) => {
    return StyleSheet.create({

    })
};

*/
