import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import URI from 'urijs';
import LoadingSpinner from '../../components/LoadingSpinner';
import BackHeader from '../../components/BackHeader';
import NoData from '../../components/NoData';
import {useAppSettingsState} from "../../context/AppSettingsContext";

function LoadingIndicatorView() {
    return (
        <LoadingSpinner/>
    );
}

function WebViewScreen(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    let userData = useSelector((rootReducer) => rootReducer.userData);
    const [details, setDetails] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let params = props.route.params;
        console.log('web details params ===> ', params)
        setUrl(params?.query);
    }, []);

    if (url !== '' && url !== undefined) {
        return (
            <SafeAreaView style={styles.container}>
                <BackHeader goBack={() => props.navigation.goBack()}/>
                <WebView
                    source={{uri: url}}
                    // source={{uri: 'https://google.com'}}
                    // domStorageEnabled={true}
                    renderLoading={LoadingIndicatorView}
                    startInLoadingState={true}
                />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={styles.nodataContainer}>
                <BackHeader goBack={() => props.navigation.goBack()}/>
                <NoData/>
            </SafeAreaView>
        );
    }
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
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
        nodataContainer: {
            flex: 1,
        },
        nodataView: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
};

export default WebViewScreen;
