import React, {useState} from 'react';
import MainContainer from "../../components/Layout/MainContainer";
import {Image, StyleSheet, Text, TextInput, View} from "react-native";
import {Button, CheckBox, Input} from "react-native-elements";
// import {globalStyle} from "../../assets/style";
import Spinner from "react-native-spinkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAppSettings, useAppSettingsDispatch, useAppSettingsState} from "../../context/AppSettingsContext";
import {
    ENV_APP_PREFIX,
    ENV_MULTI_TENANCY,
} from '@env';
import {globalStyle} from "../../assets/style";

export function LandingScreen(props) {

    const appSettingDispatch = useAppSettingsDispatch();
    const {config} = useAppSettingsState();
    // const styles = useStyles(config.style);
    // const globalStyle = {...config.style};

    const [hasCode, setHasCode] = useState(false);
    // const [appCode, setAppCode] = useState(ENV_APP_PREFIX);
    const [appCode, setAppCode] = useState('');
    const [loading, setLoading] = useState(false);

    const buttonHandler = () => {
        setLoading(true);
        let code = hasCode ? appCode : ENV_APP_PREFIX;
        getAppSettings(appSettingDispatch, code).then(async (res) => {
            setLoading(false);
            global.app_prefix = code;
            await AsyncStorage.setItem("app_prefix", code);
            props.navigation.navigate('SignIn');
        }).catch(err => {
            setLoading(false);
        })
    };

    return (
        <MainContainer style={styles.container}>

            <Image
                source={
                    __DEV__
                        ? require('../../assets/images/splash.png')
                        : require('../../assets/images/splash.png')
                }
                style={styles.welcomeImage}
            />

            <Text style={styles.title}>Crowe MacKay App Solution</Text>
            <View style={styles.formContainer}>
                <CheckBox
                    center
                    title='Do you have an app code?'
                    checked={hasCode}
                    checkedColor={globalStyle?.primary_color_2}
                    containerStyle={styles.checkbox}
                    onPress={() => setHasCode(!hasCode)}
                />
                {hasCode && <TextInput
                    mode={'outlined'}
                    placeholder={"Code"}
                    style={styles.textInput}
                    value={appCode}
                    onChangeText={code => setAppCode(code)}
                />}
                <Button
                    title="Get Started"
                    // type="outline"
                    containerStyle={styles.button}
                    buttonStyle={{backgroundColor: globalStyle?.primary_color_2}}
                    onPress={buttonHandler}
                    loading={loading}
                />

            </View>

            {loading && <View style={styles.loadingContainer}>
                <Spinner
                    style={styles.spinner}
                    type={'Circle'}
                    isVisible={true}
                    color={globalStyle?.primary_color_2}
                    size={20}
                />
                <Text style={styles.loadingText}>Loading Settings ...</Text>
            </View>}
        </MainContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: globalStyle.primary_color_2,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    textInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: globalStyle.gray_tone_3,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
    },
    checkbox: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: 'transparent',
        flexDirection: "row",
        justifyContent: 'flex-start'
    },
    formContainer: {
        marginTop: 30,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
    loadingContainer: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: globalStyle.primary_color_2,
    },
    spinner: {
        marginRight: 10,
    }
})
/*
const useStyles = (globalStyle) => {
    return
};*/

/*
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: globalStyle.primary_color_2,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    textInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: globalStyle.gray_tone_3,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
    },
    checkbox: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: 'transparent',
        flexDirection: "row",
        justifyContent: 'flex-start'
    },
    formContainer: {
        marginTop: 30,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
    loadingContainer: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: globalStyle.primary_color_2,
    },
    spinner: {
        marginRight: 10,
    }
});
*/
