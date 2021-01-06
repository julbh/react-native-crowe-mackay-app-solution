import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
import {app_mode, BASE_URL, X_API_KEY} from '../../config';

// const app_prefix = global.app_prefix;

export const doLogin = (options) => {

    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('app_prefix').then(res => {
// fetch(`${BASE_URL}dev/passwordlesslogin`, {
            let app_prefix = res || '';
            console.log('app_prefix login ==> ', global.app_prefix, app_prefix)
            fetch(`${BASE_URL}dev/passwordlesslogin`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'x-api-key': X_API_KEY,
                    'x-api-key': X_API_KEY,
                },
                body: JSON.stringify({
                    ...options,
                    prefix: app_prefix,
                    mode: app_mode
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    if (response.access_token !== undefined) {
                        AsyncStorage.multiSet([
                            ['access_token', response.access_token],
                            ['refresh_token', response.refresh_token],
                            ['id_token', response.id_token],
                        ]);
                        // return true
                        resolve({token: response.access_token, id_token: response.id_token});
                        // resolve(response.access_token);
                    } else {
                        Toast.showWithGravity('Login failed. Please try again.', Toast.LONG, Toast.BOTTOM, [
                            'RCTModalHostViewController',
                        ]);
                        /*Toast.show('Login failed. Please try again.', Toast.LONG, [
                            'UIAlertController',
                        ]);*/
                        reject(false);
                    }
                })
                .catch((error) => {
                    console.log('login failed ', error)
                    Toast.showWithGravity('Login failed. Please try again.', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                    reject(false);
                })
                .finally(() => {
                    // console.log('done')
                    reject(true);
                });
        }).catch(err => {
            console.log('login failed ', err)
            reject(false);
        })
    });
};

export const tokenVerify = () => {
    /*AsyncStorage.multiGet(['access_token', 'app_prefix']).then(values => {
        console.log('token verify ==> ', values, values[0][1]);
        const token = values[0][1];
        const app_prefix = values[1][1];
    })*/

    return new Promise((resolve, reject) => {
        AsyncStorage.multiGet(['access_token', 'app_prefix']).then(values => {
            const token = values[0][1];
            let app_prefix = values[1][1] || '';
            global.app_prefix = app_prefix;
            console.log('token verify ==> ', global.app_prefix, values, values[0][1]);
            // fetch(`${BASE_URL}dev/tokenverified`, {
            fetch(`${BASE_URL}dev/tokenverified`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'x-api-key': X_API_KEY,
                    'x-api-key': X_API_KEY,
                },
                body: JSON.stringify({
                    token,
                    prefix: app_prefix,
                    mode: app_mode
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then(async (response) => {
                    if (response.msg === 'success') {
                        try {
                            let id_token = await AsyncStorage.getItem('id_token');
                            resolve({token, id_token});
                        } catch (e) {
                            reject(null)
                        }
                        // dispatch({type: 'REFRESH_TOKEN', access_token: token});
                    } else {
                        // dispatch({type: 'REFRESH_TOKEN', access_token: null});
                        reject(null);
                    }
                })
                .catch((error) => {
                    Alert.alert(error.json());
                    // dispatch({type: 'REFRESH_TOKEN', access_token: null});
                    reject(null);
                })
                .finally(() => {
                    // dispatch({type: 'REFRESH_TOKEN', access_token: null});
                    reject(null);
                });
        })
            .catch(err => {
                reject(null);
            });
    });

    /*return new Promise((resolve, reject) => {
        AsyncStorage.getItem('access_token')
            .then((token) => {
                console.log('token ===> ', token)
                // fetch(`${BASE_URL}dev/tokenverified`, {
                fetch(`${BASE_URL}dev/tokenverified`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        // 'x-api-key': X_API_KEY,
                        'x-api-key': X_API_KEY,
                    },
                    body: JSON.stringify({
                        token,
                        prefix: app_prefix,
                        mode: app_mode
                    }),
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then(async (response) => {
                        if (response.msg === 'success') {
                            try {
                                let id_token = await AsyncStorage.getItem('id_token');
                                resolve({token, id_token});
                            } catch (e) {
                                reject(null)
                            }
                            // dispatch({type: 'REFRESH_TOKEN', access_token: token});
                        } else {
                            // dispatch({type: 'REFRESH_TOKEN', access_token: null});
                            reject(null);
                        }
                    })
                    .catch((error) => {
                        Alert.alert(error.json());
                        // dispatch({type: 'REFRESH_TOKEN', access_token: null});
                        reject(null);
                    })
                    .finally(() => {
                        // dispatch({type: 'REFRESH_TOKEN', access_token: null});
                        reject(null);
                    });
            })
            .catch(err => {
                reject(null);
            });
    });*/
};

export const requestCode = (options) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        // fetch(`${BASE_URL}dev/passwordless`, {
        fetch(`${BASE_URL}dev/passwordless`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // 'x-api-key': X_API_KEY,
                'x-api-key': X_API_KEY,
            },
            body: JSON.stringify({
                ...options,
                prefix: app_prefix,
                mode: app_mode
            }),
        })
            .then((response) => {
                console.log('request code res ==> ', response)
                return response.json();
            })
            .then((response) => {
                if (response.MessageId) {
                    resolve(response.MessageId);
                } else {
                    reject(false)
                }
            })
            .catch((error) => {
                console.log('error ===> ', error);
                Alert.alert(error);
                reject(false);
            })
            .finally(() => {
                // console.log('done')
                reject(true);
            });
    });
};
