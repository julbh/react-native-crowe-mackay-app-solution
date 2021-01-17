import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import {globalStyle} from '../../../../assets/style';
import {useAppSettingsState} from '../../../../context/AppSettingsContext';

export default function LoadingScreen({rounded}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    return (
        <View style={{backgroundColor: 'white'}}>
            <SkeletonPlaceholder>
                <View style={styles.container}>
                    {rounded ?
                        <View style={{width: 40, height: 40, borderRadius: 50}}/>
                        :
                        <View style={{width: 40, height: 40}}/>
                    }
                    <View style={{marginLeft: 20}}>
                        <View style={{width: 160, height: 20, borderRadius: 4}}/>
                        <View
                            style={{...styles.textContainer, width: 240}}
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
            borderRadius: 4,
        },
    });
};
