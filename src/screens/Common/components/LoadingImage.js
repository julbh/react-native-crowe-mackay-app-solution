import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import {globalStyle} from '../../../assets/style';
import {useAppSettingsState} from "../../../context/AppSettingsContext";


export default function LoadingImage() {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    return (
        <View style={{backgroundColor: 'white'}}>
            <SkeletonPlaceholder>
                <View style={styles.container}>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            width: Dimensions.get('window').width,
            height: 300,
        },
    })
};
