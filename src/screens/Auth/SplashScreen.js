import * as React from 'react';
import {Image, Platform, StyleSheet, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useAppSettingsState} from "../../context/AppSettingsContext";

export default function SplashScreen() {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.welcomeContainer}>
                    <Image
                        source={
                            __DEV__
                                ? require('../../assets/images/splash.png')
                                : require('../../assets/images/splash.png')
                        }
                        style={styles.welcomeImage}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

SplashScreen.navigationOptions = {
    header: null,
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        contentContainer: {
            height: '100%',
        },
        welcomeContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        },
        welcomeImage: {
            width: 100,
            height: 80,
            resizeMode: 'contain',
            marginTop: 3,
            marginLeft: -10,
        },
    })
};
