import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

function LoadingIndicatorView() {
    return (
        <LoadingSpinner/>
    );
}

function ProgramDetails(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const [details, setDetails] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let params = props.route.params;
        console.log(params.data.url);
        if (params.data.url !== undefined) {
            setUrl(params.data.url);
        }
        setDetails(params);
        props.navigation.setParams({
            id: null,
        });
        console.log('details route', props.route);
    }, []);

    if (url !== '' && url !== undefined) {
        return (
            <View style={styles.container}>
                <WebView
                    source={{uri: details.data.url}}
                    renderLoading={LoadingIndicatorView}
                    startInLoadingState={true}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.nodataView}>
                <Text>
                    No Details
                </Text>
            </View>
        );
    }
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
        nodataView: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
};

export default ProgramDetails;
