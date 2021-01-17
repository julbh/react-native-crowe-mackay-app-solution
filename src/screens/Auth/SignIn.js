import React, {useState, useEffect, useContext, useRef} from 'react';
import {
    KeyboardAvoidingView,
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    Animated,
    ActivityIndicator,
    Keyboard, ScrollView, TouchableOpacity,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {AuthContext} from '../../../App';
import {requestCode} from '../../services/auth';
import Toast from 'react-native-simple-toast';
import logo from '../../assets/images/splash.png';
// import {globalStyle} from '../../assets/style';
import {useAppSettingsState} from "../../context/AppSettingsContext";
import LoadingOverlay from "../../components/LoadingOverlay";
import {
    ENV_APP_PREFIX,
    ENV_MULTI_TENANCY,
} from '@env';

const SigninScreen = ({navigation}) => {
    const flag = ENV_MULTI_TENANCY === "1";
    const {config} = useAppSettingsState();
    const {signIn} = useContext(AuthContext);
    const style = useStyles(config.style);

    const [email, setEmail] = useState('rex.fong@crowemackay.ca');
    const [token, setToken] = useState('889761');
    // const [email, setEmail] = useState('');
    // const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const keyboardHeight = useRef(new Animated.Value(160)).current;
    const imageTransform = useRef(new Animated.Value(1)).current;
    const contentTransform = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = (event) => {
        console.log('event ==> ', event);
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: 0,
                // toValue: event.endCoordinates.height,
                useNativeDriver: true,
            }),
            Animated.timing(imageTransform, {
                duration: event.duration,
                toValue: 0.6,
                useNativeDriver: true,
            }),
            Animated.timing(contentTransform, {
                duration: event.duration,
                toValue: -40,
                useNativeDriver: true,
            }),
        ]).start();

    };

    const _keyboardDidHide = (event) => {
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: 160,
                useNativeDriver: true,
            }),
            Animated.timing(imageTransform, {
                duration: event.duration,
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(contentTransform, {
                duration: event.duration,
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start();

    };

    const onRequestCode = () => {
        if (!email) {
            Alert.alert('Please enter your email.');
            return;
        } else {
            setLoading(true);
            requestCode({email}).then((res) => {
                setLoading(false);
                // setEmail('');
                Toast.showWithGravity('You have received the Code. Please check your email.', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            }).catch(err => {
                console.log(err);
                Toast.showWithGravity('Request Code failed. Please try again.', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
                setLoading(false);
                // setEmail('');
            });
        }
    };

    /*if (loading) {
        return <LoadingSpinner/>
    }*/

    return (
        <View style={style.container}>
            {flag && <View style={style.backContainer}>
                <Button
                    type="clear"
                    icon={
                        <Icon name='arrow-left' type="material-community"/>
                    }
                    buttonStyle={{borderRadius: 100,}}
                    onPress={() => navigation.goBack()}
                />
                <Text style={{fontWeight: 'bold', fontSize: 16,}}>Back</Text>
            </View>}
            <Animated.View
                style={[style.header, {transform: [{translateY: keyboardHeight}]}]}
                behavior="padding"
            >
                <Animated.Image
                    source={flag ? (config?.loading_logo ? {uri: config.loading_logo} : logo) : logo}
                    // source={logo}
                    style={{width: 160, height: 150, transform: [{scale: imageTransform}]}}/>
                <Animated.View style={{...style.inputContainer, transform: [{translateY: contentTransform}]}}>
                    <Input
                        label="Email"
                        placeholder="Enter Your Email"
                        leftIcon={{name: 'mail-outline'}}
                        value={email}
                        onChangeText={
                            (text) => {
                                setEmail(text.toLowerCase());
                            }
                        }
                    />
                    <Input
                        label="Code"
                        placeholder="Enter Your Code"
                        leftIcon={{name: 'lock-outline'}}
                        value={token}
                        onChangeText={
                            (text) => {
                                setToken(text);
                            }
                        }
                    />
                    <View style={style.btnBackground}>
                        <Button
                            color="#000"
                            buttonStyle={style.loginBtn}
                            title="Login"
                            onPress={() => {
                                signIn({email: email.trim(), token: token.trim()});
                                setEmail('');
                            }
                            }
                        />
                    </View>
                    {config?.app_settings?.allow_public_registration && <View style={style.requestBackground}>
                        <TouchableOpacity onPress={() => onRequestCode()}>
                            <Text style={style.requestLink}>Retrieve code via email</Text>
                        </TouchableOpacity>
                    </View>}
                </Animated.View>

            </Animated.View>
            {
                (loading) && <LoadingOverlay/>
            }
        </View>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
        },
        header: {
            flex: 1,
            paddingHorizontal: 24,
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingTop: 0,
            width: '100%',
        },
        inputContainer: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#fff',
            width: '100%',
        },
        title: {
            fontSize: 36,
            textAlign: 'center',
            fontWeight: '500',
            paddingBottom: 20,
        },
        input: {
            borderWidth: 1,
            width: '100%',
            margin: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
            fontSize: 18,

        },
        loginBtn: {
            width: '100%',
            backgroundColor: globalStyle.primary_color_2,
        },
        btnBackground: {
            width: '100%',
            height: 40,
            borderRadius: 4,
        },
        requestBackground: {
            paddingVertical: 10,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
        requestLink: {
            color: globalStyle.primary_color_2,
            textDecorationLine: 'underline',
        },
        backContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            width: '100%',
            padding: 5,
            alignItems: 'center',
            position: "absolute",
            top: 0,
        },
    });
};

export default SigninScreen;
