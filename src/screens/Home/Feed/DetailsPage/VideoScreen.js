import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

export default function VideoScreen(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const [videoUri, setVideo] = useState(null);

    useEffect(() => {
        const initial = Orientation.getInitialOrientation();
        console.log('orientation', initial)
        // Orientation.lockToLandscape();
        // Orientation.lockToPortrait();
        if (initial === 'PORTRAIT') {
            // do something
            // Orientation.lockToPortrait();
        } else {
            // do something else
            // Orientation.lockToLandscape();
        }
        Orientation.addOrientationListener(_orientationDidChange);
        setVideo(props.route.params[0])

        return () => {
            Orientation.removeOrientationListener(_orientationDidChange);
            Orientation.unlockAllOrientations();
        }
    });

    const _orientationDidChange = (orientation) => {
        console.log('orientation changed ... ', orientation)
        if (orientation === 'LANDSCAPE') {
            // do something with landscape layout
            Orientation.lockToLandscape();
        } else {
            // do something with portrait layout
            Orientation.lockToPortrait();
        }
    };

    if(!videoUri) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <VideoPlayer
            source={{uri: videoUri}}
            tapAnywhereToPause={true}
            // style={{width: 800, height: 600}}
            // videoStyle={{width: 600, height: 400}}
            // navigator={this.props.navigator}
            // onBack={() => this.props.navigation.navigate('Home')}
            onBack={() => props.navigation.goBack()}
            onEnd={() => props.navigation.goBack()}
            // videoStyle={{transform: [{ rotate: '90deg'}]}}
        />
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
    })
};
