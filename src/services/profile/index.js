import axios from 'axios';
import {BASE_URL, X_API_KEY} from '../../config';

export const uploadAvatar = (data, blob, fileInfo) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + 'dev/s3/update', {
            headers: {
                'X-Api-Key': X_API_KEY,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => {
            return res.json();
        }).then(res => {
            let file = new File([blob], {type: fileInfo.type});
            // let file = new File([blob], {type: fileInfo.mime});
            console.log('file >>>>>>>>>>>>>>>>>', res, file, fileInfo.mime);
            fetch(res, {
                headers: {
                    'Content-Type': fileInfo.type,
                    // 'Content-Type': fileInfo.mime,
                    'x-amz-acl': 'public-read',
                },
                method: 'PUT',
                body: file,
                contentType: fileInfo.type,
                // contentType: fileInfo.mime,
                processData: false,
            }).then(res => {
                let url = `https://assets.tcog.hk/${data.Key}`;
                resolve(url);
            }).catch(err => {
                console.log('err ==> ', err);
                reject(err);
            });
        }).catch(err => {
            console.log('err 111 ==> ', err);
            reject(err);
        });
    });
};

export const updateAvatar = (url, user_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        const api = axios.create({baseURL: BASE_URL});
        let config = {
            method: 'put',
            url: `dev/db/users/${user_id}`,
            // url: 'dev/db/users/5f6a81fc1602a40008b0031d',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: {
                picture: url,
            },
        };
        api(config)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const updateProfileService = (data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        const api = axios.create({baseURL: BASE_URL});
        let config = {
            method: 'put',
            url: `dev/db/users/${data.user_id}`,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: data,
        };
        api(config)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const getUserProfile = (user_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        const api = axios.create({baseURL: BASE_URL});
        let config = {
            method: 'get',
            url: `dev/db/${app_prefix}users/${user_id}`,
            // url: 'dev/db/users/5f6a81fc1602a40008b0031d',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        };
        api(config)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};
