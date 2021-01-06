import axios from 'axios';
import { BASE_URL, BEAMS_INSTANCE_ID, BEAMS_SECRET_KEY, X_API_KEY} from '../../config';

let apiEnd = axios.create({baseURL: BASE_URL});

export const getCountersService = (query) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}counters?${query}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                console.log('getCountersService app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                console.log('==> ', err);
                reject(err);
            });
    });
};

export const addCounterService = (data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}counters`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                console.log('==> ', err);
                reject(err);
            });
    });
};

export const updateCounterService = (object_id, data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}counters/${object_id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                console.log('==> ', err);
                reject(err);
            });
    });
};
