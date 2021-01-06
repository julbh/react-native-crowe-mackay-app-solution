// Get your interest
import RNPusherPushNotifications from 'react-native-pusher-push-notifications';
import {BEAMS_INSTANCE_ID} from '../../config';
import Toast from 'react-native-simple-toast';
import MToast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useDispatch} from 'react-redux';
import * as Actions from '../../redux/actions';
import {Platform} from "react-native";

const donutsInterest = 'debug-public12345';

let dispatch = null;

// Initialize notifications
export const init = (user_id, dispatchAction) => {
    const app_prefix = global.app_prefix;
    dispatch = dispatchAction;
    // Set your app key and register for push
    RNPusherPushNotifications.setInstanceId(BEAMS_INSTANCE_ID);

    // Init interests after registration
    RNPusherPushNotifications.on('registered', () => {
        console.log(app_prefix)
        subscribe(donutsInterest);
        // subscribe('debug-'+user_id);
        if (app_prefix === '') {
            subscribe(`debug-${user_id}`);
        } else {
            subscribe(`debug-${app_prefix}-${user_id}`);
        }
    });

    // Setup notification listeners
    RNPusherPushNotifications.on('notification', handleNotification);
};

// Handle notifications received
const handleNotification = (notification) => {
    let tag = notification.tag;
    let tagData = tag === undefined ? null : JSON.parse(tag);
    if (tagData) {

        const isInChatBox = (tag_data, users) => {
            console.log('is in chat box ===> ', tag_data.channel_payload._user_ids, users);
            let f = users.length > 0;
            users.map(u => {
                f = f && (tag_data.channel_payload._user_ids.includes(u._id));
            });
            return f;
        };

        AsyncStorage.getItem('chatUsers').then((sUsers) => {
            console.log('get users from storage ===> ', tagData, JSON.parse(sUsers), isInChatBox(tagData, JSON.parse(sUsers)));
            if (!isInChatBox(tagData, JSON.parse(sUsers))) {
                MToast.show({
                    text1: notification.title,
                    text2: notification.body,
                });
            }
        });
    } else {
        if (dispatch) {
            dispatch(Actions.getInboxAction());
        }
        MToast.show({
            text1: notification.title,
            text2: notification.body,
        });
    }
    // iOS app specific handling
    /*if (Platform.OS === 'ios') {
        switch (notification.appState) {
            case 'inactive':
                // console.log(notification);
            // inactive: App came in foreground by clicking on notification.
            //           Use notification.userInfo for redirecting to specific view controller
            case 'background':
                // console.log(notification);
            // background: App is in background and notification is received.
            //             You can fetch required data here don't do anything with UI
            case 'active':
                // console.log(notification);
            // App is foreground and notification is received. Show a alert or something.
            default:
                break;
        }
    } else {
        // console.log(notification);
        // console.log("android handled notification...");
    }*/
};

// Subscribe to an interest
const subscribe = interest => {
    // Note that only Android devices will respond to success/error callbacks
    RNPusherPushNotifications.subscribe(
        interest,
        (statusCode, response) => {
            console.error(statusCode, response);
        },
        () => {
            console.log('Success subscribe ', interest);
        },
    );
};

// Unsubscribe from an interest
const unsubscribe = interest => {
    if (Platform.OS === 'ios') {
        RNPusherPushNotifications.unsubscribe(interest);
    } else {
        RNPusherPushNotifications.unsubscribe(
            interest,
            (statusCode, response) => {
                console.log(statusCode, response);
            },
            () => {
                console.log('unsubscribe Success', interest);
            },
        );
    }
};

export const unsubscribeAll = (user_id) => {
    const app_prefix = global.app_prefix;
    console.log('unsubscribe all ==> ', user_id, app_prefix)
    unsubscribe(donutsInterest);
    // subscribe('debug-'+user_id);
    if (app_prefix === '') {
        unsubscribe(`debug-${user_id}`);
    } else {
        unsubscribe(`debug-${app_prefix}-${user_id}`);
    }
};
