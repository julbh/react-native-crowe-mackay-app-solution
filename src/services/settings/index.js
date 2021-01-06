import axios from 'axios';
import {BASE_URL, X_API_KEY} from '../../config';
import moment from 'moment';
import {getMicroAppBulkService} from "../microApps";

let apiEnd = axios.create({baseURL: BASE_URL});

export const getSettingsService = () => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}settings`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                resolve(res.data);
            })
            .catch(err => {
                reject(null);
            });
    });
};

export const getAppSettingsService = (code) => {
    return new Promise((resolve, reject) => {
        // apiEnd(`dev/db/apps?data.prefix=${app_prefix}`, {
        apiEnd(`dev/db/apps?data.prefix=${code}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                let config = res.data[0];
                if(Boolean(config)){
                    try{
                        let micro_apps = await getMicroAppBulkService(config.data?.app_settings?.microapp_tabs, code);
                        config.data.app_settings.microapp_tabs = micro_apps;
                    }catch (e) {
                    }
                    resolve(config);
                }else {
                    resolve(null);
                }
            })
            .catch(err => {
                reject(null);
            });
    });
};
