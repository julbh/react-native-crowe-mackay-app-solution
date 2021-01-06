import axios from 'axios';
import {
    ENV_WC_VERSION
} from '@env';

let wcAPI;

export const getCategoriesService = (config) => {
    const app_prefix = global.app_prefix;
    wcAPI = axios.create({
        baseURL: `${config?.base_url}/wp-json/${ENV_WC_VERSION}`,
        params: {
            consumer_key: config?.consumer_key,
            consumer_secret: config?.consumer_secret,
        },
    });
    return new Promise((resolve, reject) => {
        wcAPI(`products/categories`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                console.log('getCategories==> ', err);
                reject(err);
            });
    });
};

export const getProductsByCategoryService = (category_id) => {
    const app_prefix = global.app_prefix;
    // wcAPI = axios.create({
    //     baseURL: `${config?.base_url}/wp-json/${ENV_WC_VERSION}`,
    //     params: {
    //         consumer_key: config?.consumer_key,
    //         consumer_secret: config?.consumer_secret,
    //     },
    // });
    return new Promise((resolve, reject) => {
        wcAPI(`products/`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                category: category_id
            }
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                console.log('getCategories==> ', err);
                reject(err);
            });
    });
};
