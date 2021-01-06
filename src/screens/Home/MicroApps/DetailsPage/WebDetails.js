import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import URI from 'urijs';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

function LoadingIndicatorView() {
    return (
        <LoadingSpinner/>
    );
}

function WebDetails(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    let userData = useSelector((rootReducer) => rootReducer.userData);
    const [details, setDetails] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let params = props.route.params;
        let id_token = userData.id_token;
        let {user_id} = (jwtDecode(id_token));
        if (params.payload.url !== undefined) {
            if (params.payload.capabilities !== undefined &&
                params.payload.capabilities &&
                params.payload.capabilities[0] !== 'NOTHING'
            ) {
                let normalizedUri = new URI(params.payload.url).normalizeQuery();
                normalizedUri.addQuery('user_id', user_id);
                setUrl(normalizedUri.normalize()._string);
                // setUrl(params.payload.url + `?user_id=${user_id}`);
            } else {
                let normalizedUri = new URI(params.payload.url).normalizeQuery();
                setUrl(normalizedUri.normalize()._string);
                // setUrl(params.payload.url);
            }
        }
        setDetails(params);
    }, []);

    if (url !== '' && url !== undefined) {
        return (
            <View style={styles.container}>
                <WebView
                    source={{uri: url}}
                    // domStorageEnabled={true}
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
        nodataView: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
};

export default WebDetails;
