import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

export default function LoadingScreen() {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    return (
        <View style={{backgroundColor: 'white'}}>
            <SkeletonPlaceholder>
                <View style={styles.container}>
                    <View style={{width: 50, height: 50, borderRadius: 50}}/>
                    <View style={{marginLeft: 20}}>
                        <View style={{width: 160, height: 15, borderRadius: 4}}/>
                        <View
                            style={{...styles.textContainer,width: 240}}
                        />
                        <View
                            style={{...styles.textContainer, width: 320}}
                        />
                        <View
                            style={{...styles.textContainer, width: 120, marginBottom: 20}}
                        />
                    </View>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            paddingLeft: 20,
            borderBottomWidth: 0.6,
            borderBottomColor: globalStyle.gray_tone_3,
        },
        textContainer: {
            marginTop: 6,
            height: 15,
            borderRadius: 4
        }
    })
};
