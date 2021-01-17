import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import {globalStyle} from '../../../assets/style';
import {useAppSettingsState} from "../../../context/AppSettingsContext";


export default function LoadingTitle({width, height, style}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    let propsStyle = style ? style : {};

    return (
        <View style={{backgroundColor: 'transparent'}}>
            <SkeletonPlaceholder>
                <View style={{...styles.container, ...propsStyle}}>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            // width: Dimensions.get('window').width / 1.5,
            // width: Dimensions.get('window').width / 2,
            height: 20,
            borderRadius: 3,
        },
    })
};
