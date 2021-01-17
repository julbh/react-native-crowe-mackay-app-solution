import {BASE_URL, X_API_KEY} from '../../config';
import axios from 'axios';

let apiEnd = axios.create({baseURL: BASE_URL});

export const getContactListService = (current_user_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/contact_list?user_id=${current_user_id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                console.log('get contact list ==> ', current_user_id,res.data)
                resolve(res.data);
            })
            .catch(err => {
                console.log('get contact list ==> ', err);
                reject(err);
            });
    });
};
