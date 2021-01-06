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

function FeedbackScreen(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const [details, setDetails] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let params = props.route.params;
        if (params.data.url !== undefined) {
            setUrl(params.data.feedback_url);
        }
        setDetails(params);
    }, []);

    return (
        <View style={styles.container}>
            {
                url !== undefined &&
                url !== '' ?
                    <WebView
                        source={{uri: details.data.feedback_url}}
                        renderLoading={LoadingIndicatorView}
                        startInLoadingState={true}
                    />
                    :
                    <Text>
                        No Details
                    </Text>
            }
        </View>
    );
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
    })
};

export default FeedbackScreen;
