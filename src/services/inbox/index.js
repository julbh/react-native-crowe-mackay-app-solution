import axios from 'axios';
import { BASE_URL, X_API_KEY} from '../../config';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from "jwt-decode";

let apiEnd = axios.create({baseURL: BASE_URL});

export const getInboxService = () => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('id_token').then(id_token => {
            let curUser = (jwtDecode(id_token));
            let query = Boolean(curUser?.user_id) ? `?data.user_id=${curUser.user_id}` : '';
            // console.log('get inbox query ****************************** ', query)
            apiEnd(`dev/db/${app_prefix}inbox${query}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': X_API_KEY,
                },
            })
                .then(async (res) => {
                    let inboxData = res.data;
                    // console.log('inbox ==> ', inboxData)
                    let inboxRes = [];
                    for (let inbox of inboxData) {
                        let tmp = {...inbox};
                        let user_res;
                        try {
                            user_res = await apiEnd(`dev/db/users/${inbox.data.user_id}`, {
                                method: 'get',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': X_API_KEY,
                                },
                            });
                        } catch (e) {
                            user_res = null;
                        }
                        tmp.userInfo = user_res?.data;
                        let author_res = null;
                        try {
                            author_res = await apiEnd(`dev/db/users/${inbox.data.author_id}`, {
                                method: 'get',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': X_API_KEY,
                                },
                            });
                        } catch (e) {
                            author_res = null;
                        }
                        let tmp_author = {
                            data: {
                                picture: inbox.data.author_img,
                                full_name: inbox.data.author_fullname,
                                email: inbox.data.author_email,
                            },
                        };
                        tmp.authorInfo = author_res ? author_res.data : tmp_author;
                        inboxRes.push(tmp);
                    }
                    resolve(inboxRes);
                })
                .catch(err => {
                    reject(null);
                });
        }).catch(err => {
            reject(null)
        })

    });
};

// data = { status, _id}
export const updateInboxService = (data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/inbox/${data._id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: {status: data.status},
        })
            .then(async (res) => {
                resolve(res);
                // console.log('update inbox ==> ', res)
            })
            .catch(err => {
                resolve(err);
            });
    });
};

export const deleteInboxService = (data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/inbox/${data._id}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                resolve(res);
                // console.log('update inbox ==> ', res)
            })
            .catch(err => {
                resolve(err);
            });
    });
};
