import axios from 'axios';
import {BASE_URL, X_API_KEY} from '../../config';


const apiBase = axios.create({baseURL: BASE_URL});

export const getFeedService0 = () => {
    const app_prefix = global.app_prefix;
    console.log('app_prefix feed ===> ', app_prefix)
    return new Promise((resolve, reject) => {
        // apiBase(`dev/db/test-posts?data.is_flagged!=TRUE`, {
        apiBase(`dev/db/${app_prefix}posts?data.is_flagged!=TRUE`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                let allFeeds = [];
                for (let feed of res.data) {
                    let tmpFeed = {...feed};
                    let user_id = feed.data.user_id;
                    let userInfo = null;
                    try {
                        userInfo = await apiBase(`dev/db/users/${user_id}`, {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': X_API_KEY,
                            },
                        });
                    } catch (e) {
                        userInfo = null;
                    }
                    if (userInfo !== null) {
                        // console.log(userInfo)
                        tmpFeed.userInfo = userInfo.data;
                        allFeeds.push(tmpFeed);
                    }
                }
                allFeeds.sort((a, b) => {
                    if (a.updatedAt > b.updatedAt) {
                        return -1;
                    }
                    if (a.updatedAt < b.updatedAt) {
                        return 1;
                    }
                    return 0;
                });
                resolve(allFeeds);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const getFeedService = (param) => {
    const app_prefix = global.app_prefix;
    console.log('app_prefix feed ===> ', app_prefix)
    let {page, user_id} = param;
    return new Promise((resolve, reject) => {
        // apiBase(`dev/db/test-posts?data.is_flagged!=TRUE`, {
        apiBase(`dev/feeds?page=${page}&user_id=${user_id}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                let allFeeds = res.data.feeds || [];
                // console.log('all feeds ==> ', allFeeds)
                /*for (let feed of res.data.feeds) {
                    let tmpFeed = {...feed};
                    let user_id = feed.data.user_id;
                    let userInfo = null;
                    try {
                        userInfo = await apiBase(`dev/db/users/${user_id}`, {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': X_API_KEY,
                            },
                        });
                    } catch (e) {
                        userInfo = null;
                    }
                    if (userInfo !== null) {
                        // console.log(userInfo)
                        tmpFeed.userInfo = userInfo.data;
                        allFeeds.push(tmpFeed);
                    }
                }*/
                allFeeds.sort((a, b) => {
                    if (a.updatedAt > b.updatedAt) {
                        return -1;
                    }
                    if (a.updatedAt < b.updatedAt) {
                        return 1;
                    }
                    return 0;
                });
                resolve({allFeeds, loadmore: res.data.load_more});
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const uploadFeedImage = (data, blob, fileInfo) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + 'dev/s3/update', {
            headers: {
                'X-Api-Key': 'vKLfYnvkkgphPdSBRuT0',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => {
            return res.json();
        }).then(res => {
            let file = new File([blob], {type: fileInfo.mime});
            console.log('file >>>>>>>>>>>>>>>>>', data, res, file, fileInfo.mime)
            const apiEnd = axios.create({baseURL: res});
            apiEnd.defaults.timeout = 60000;
            apiEnd.put('', {
                headers: {
                    'Content-Type': fileInfo.mime,
                    'x-amz-acl': 'public-read',
                },
                data: file
            })
            .then(res => {
                let url = `https://assets.tcog.hk/${data.Key}`;
                console.log('res url ============================>>>>>>>>>>', url)
                resolve(url);
            }).catch(err => {
                reject(err);
            })
            /* fetch(res, {
                headers: {
                    'Content-Type': fileInfo.mime,
                    'x-amz-acl': 'public-read',
                },
                method: 'PUT',
                body: file,
                contentType: fileInfo.mime,
                processData: false,
            }).then(res => {
                let url = `https://assets.tcog.hk/${data.Key}`;
                console.log('res url ============================>>>>>>>>>>', url)
                resolve(url);
            }).catch(err => {
                reject(err);
            }) */
        }).catch(err => {
            reject(err);
        });
    });
};

export const uploadFeedService = (data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiBase('dev/db/posts', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: data,
        })
            .then(async (res) => {
                let feed = res.data[0];
                let tmpFeed = {...feed};
                let user_id = feed.data.user_id;
                let userInfo = await apiBase(`dev/db/users/${user_id}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': X_API_KEY,
                    },
                });
                tmpFeed.userInfo = userInfo;
                resolve(tmpFeed);
            })
            .catch(err => {
                reject(err);
            });
    });
};

import * as chatService from './chatService';

export default chatService;

export const test = () => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiBase('dev/db/posts', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then((res) => {

            })
            .catch(err => {

            });
    });
};
