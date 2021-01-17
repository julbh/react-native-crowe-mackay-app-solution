import axios from 'axios';
import _ from 'lodash';
import {BASE_URL, X_API_KEY} from '../../config';
import moment from 'moment';
import human from 'human-time';
import {Platform} from 'react-native';
// import { getVideoDurationInSeconds } from 'get-video-duration';
// import mp3Duration from 'mp3-duration';

export const DATA = [
    {
        _id: '1',
    },
    {
        _id: '2',
    },
    {
        _id: '3',
    },
    {
        _id: '4',
    },
    {
        _id: '5',
    },
];

const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';

export const uriToBlob = (uri) => {
    console.log('uri to blob ******** ', uri);
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // return the blob
            resolve(xhr.response);
        };

        xhr.onerror = function () {
            // something went wrong
            reject(new Error('uriToBlob failed'));
        };
        // this helps us get a blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);

        xhr.send(null);
    });
};

export const createShortCode = () => {
    let word = '';
    for (let i = 0; i < 10; i += 1) {
        word += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return word;
};

const isDate = (date) => {
    return (new Date(date) !== 'Invalid Date') && !isNaN(new Date(date));
};

export const parseMedia = (m) => {
    let images = [];
    let videos = [];
    let media = [...m];
    if (media !== undefined) {
        media.map((item, index) => {
            if (item.includes('.mp4')) {
                videos.push(item);
            } else {
                images.push(item);
            }
        });
    }
    return {images, videos};
};

export const timeToSeconds = (timestring) => {
    let a = timestring.split(':'); // split it at the colons
    let h = 0;
    let m = 0;
    let s = 0;
    if (a.length === 3) {
        h = a[0] || 0;
        m = a[1] || 0;
        s = a[2] || 0;
    } else if (a.length === 2) {
        h = 0;
        m = a[0] || 0;
        s = a[1] || 0;
    } else {
        h = m = 0;
        s = a[0] || 0;
    }

    let seconds = (+h) * 60 * 60 + (+m) * 60 + (+s);
    // console.log('seconds ===> ', seconds)
    return seconds;
};

export const secondsToTime = (seconds) => {
    return moment('1900-01-01 00:00:00').add(seconds, 'seconds').format('HH:mm:ss');
};

export const makeImageUri = (path) => {
    return `file://${path}`;
};

export const isExistUsersInArray = (arr1, arr2) => {
    let flag = false;
    arr1.map(item => {
        let sortedUsers1 = _.sortBy(item.data.channel_payload.users, ['_id']);
        let sortedUsers2 = _.sortBy(arr2, ['_id']);
        if (_.isEqual(sortedUsers1, sortedUsers2)) {
            flag = true;
        }
    });
    return flag;
};

let apiEnd = axios.create({baseURL: BASE_URL});

export const getUsersByIds = async (user_ids) => {
    const app_prefix = global.app_prefix;
    try {
        let query = user_ids.join(',');
        let usersRes = await apiEnd(`dev/db/${app_prefix}users?_id=${query}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        });
        return usersRes.data;
    } catch (e) {
        return null;
    }
};

export const toHumanTime = (date_time) => {
    return human((Date.now() - (new Date(date_time)).getTime()) / 1000);
};

/**
 * For Database form Key ==> key_id : Key Id
 * @returns {string}
 */
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

export const normalizeKey = (key) => {
    let subKeys = key.split('_');
    let tmp = [];
    subKeys.map((it, index) => {
        tmp.push(it.capitalize());
    });
    return tmp.join(' ');
};

/*export const getVideoDuration = (url) => {
    return new Promise((resolve, reject) => {
        getVideoDurationInSeconds(url).then((duration) => {
            console.log(duration)
            resolve(duration);
        }).catch(err => {
            reject(err);
        })
    })
};*/

/*export const getAudioDuration = (url) => {
    return new Promise((resolve, reject) => {
        mp3Duration(url, function (err, duration) {
            if (err) reject(err);
            resolve(duration);
            console.log('Your file is ' + duration + ' seconds long');
        });
    })
};*/
