import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import URI from 'urijs';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";
import Pdf from 'react-native-pdf';

function LoadingIndicatorView() {
    return (
        <LoadingSpinner/>
    );
}

function PDFDetails(props) {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';
    const styles = useStyles(config.style);

    let userData = useSelector((rootReducer) => rootReducer.userData);
    const [details, setDetails] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let params = props.route.params;
        let id_token = userData.id_token;
        let {user_id} = auth_strategy ? {} : (jwtDecode(id_token));
        if (Boolean(params.payload?.url)) {
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
        }else if(Boolean(params.landing_url)){
            let normalizedUri = new URI(params.landing_url).normalizeQuery();
            setUrl(normalizedUri.normalize()._string);
        }
        setDetails(params);
    }, []);

    console.log('pdf url ============> ', url)

    if(loading) return <LoadingSpinner/>

    if (url !== '' && url !== undefined) {
        return (
            <View style={styles.container}>
                <Pdf
                    source={{uri: url}}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        setLoading(false);
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        setLoading(false);
                        console.log(error);
                    }}
                    onPressLink={(uri)=>{
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>
                {/*<WebView
                    source={{uri: url}}
                    // domStorageEnabled={true}
                    renderLoading={LoadingIndicatorView}
                    startInLoadingState={true}
                />*/}
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
        pdf: {
            flex:1,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height,
        }
    })
};

export default PDFDetails;
