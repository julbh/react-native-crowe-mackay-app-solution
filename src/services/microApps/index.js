import axios from 'axios';
import {app_prefix, BASE_URL, BEAMS_INSTANCE_ID, BEAMS_SECRET_KEY, X_API_KEY} from '../../config';
import {getUserById} from '../users';
import {
    ENV_CHECK_SUBSCRIPTION,
} from '@env';
import _ from 'lodash';

let apiEnd = axios.create({baseURL: BASE_URL});

export const getMicroAppsService = () => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db_tree/${app_prefix}microapps?formatted=1`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                // let result = res.data.filter(o => !Boolean(o.is_hidden))
                // console.log('micro app data ==> ', result, `dev/db_tree/${app_prefix}microapps?formatted=1`, app_prefix, res.data);
                resolve(res.data);
            })
            .catch(err => {
                console.log('agenda==> ', err);
                reject(err);
            });
    });
};

export const getAllUsersService = (current_user_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}users?_id!=${current_user_id}&skip=0&limit=10000&sort=data.full_name`, {
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
                // console.log('agenda==> ', err);
                reject(err);
            });
    });
};

export const dynamicFetch = (url, sub_item) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev${url}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                // console.log(res);
                if (!Boolean(sub_item)) {
                    resolve(res.data);
                } else {
                    let result = [];
                    for (let item of res.data) {
                        let tmp = {};
                        try {
                            let user = await getUserById(item.data[sub_item]);
                            tmp = {
                                ...item,
                                user: user.data,
                            };
                        } catch (e) {
                            tmp = {
                                ...item,
                                user: null,
                            };
                        }
                        result.push(tmp);
                    }
                    resolve(result);
                }
            })
            .catch(err => {
                // console.log(err);
                reject(err);
            });
    });
};

export const submitFormService = (data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        // const api = axios.create({baseURL: BASE_URL});
        let config = {
            method: 'post',
            url: `dev/db/${app_prefix}forms/`,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: data,
        };
        apiEnd(config)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const getAlbumsService = (url) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        // const api = axios.create({baseURL: BASE_URL});
        let config = {
            method: 'get',
            url: `dev${url}`,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        };
        apiEnd(config)
            .then(res => {
                let albums = {
                    data: res.data,
                    tags: getAlbumTags(res.data),
                };
                resolve(albums);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const getAlbumTags = (albums) => {
    let ret = [];
    albums.forEach(album => {
        let tmpTags = album.data.tags;
        ret = [...new Set([...ret, ...tmpTags])];
    });
    return ret;
};

export const getPlaylistService = (album_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        // const api = axios.create({baseURL: BASE_URL});
        let config = {
            method: 'get',
            url: `dev/db/${app_prefix}tracks?data.album_id=${album_id}&sort=data.order`,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        };
        apiEnd(config)
            .then(async (res) => {
                let playlist = res.data;
                let result = [];
                let user_ids = [];
                for (let item of playlist) {
                    user_ids = [...user_ids, ...item.data.user_ids];
                }
                let query = user_ids.join(',');
                let usersRes = await apiEnd(`dev/db/users?_id=${query}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': X_API_KEY,
                    },
                });
                let allUsersById = _.keyBy(usersRes.data, '_id');
                console.log('allUsersById ===> ', allUsersById);
                for (let item of playlist) {
                    console.log('track ===> ', item);
                    let tmp = {};
                    try {
                        let user_ids = item.data.user_ids;
                        let tmpUsers = [];
                        for (let u of user_ids) {
                            tmpUsers.push(allUsersById[u]);
                        }
                        tmp.users = tmpUsers;
                    } catch (e) {
                        tmp.users = null;
                    }
                    tmp.playlist = item;
                    result.push(tmp);
                }
                /*for (let item of playlist) {
                    console.log('track ===> ', item);
                    let tmp = {};
                    try {
                        let user_ids = item.data.user_ids;
                        let query = user_ids.join(',');
                        let usersRes = await apiEnd(`dev/db/users?_id=${query}`, {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': X_API_KEY,
                            },
                        });
                        tmp.users = usersRes.data;
                    } catch (e) {
                        tmp.users = null;
                    }
                    tmp.playlist = item;
                    result.push(tmp);
                }*/
                console.log('result ==> ', result);
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const getMicroAppByIdService = (app_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}microapps/${app_id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const getMicroAppBulkService = (ids, app_prefix) => {
    // const app_prefix = global.app_prefix;
    let query = ids.join(',');
    return new Promise((resolve, reject) => {
        if (ids.length === 0) {
            resolve([]);
        }
        apiEnd(`dev/db/${app_prefix}microapps?_id=${query}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const dynamicDelete = (url) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev${url}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                console.log(res);
                resolve(res);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

export const getCommentService = (data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}database_comment?data.reference_id=${data.reference_id}&data.commenter_id=${data.commenter_id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                let result = [];
                for (let item of res.data) {
                    let user_data = {};
                    try {
                        user_data = await getUserById(item.data.commenter_id);
                    } catch (e) {
                        user_data = {};
                    }
                    let tmp = {
                        ...item,
                        user_data: user_data.data.data,
                    };
                    result.push(tmp);
                }
                resolve(result);
                // resolve(res.data);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

export const getCommentByIdService = (_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}database_comment/${_id}`, {
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
                reject(err);
            });
    });
};

export const postCommentService = (comment_id, data, method) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}database_comment/${comment_id}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data,
        })
            .then(async (res) => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const sendNotificationService = (payload) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/push_notification/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: {
                ...payload,
                beam_id: BEAMS_INSTANCE_ID,
                beam_secret: BEAMS_SECRET_KEY,
            },
        })
            .then(async (res) => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const getAnythingService = (_id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}_anything/${_id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

/////// CHECK PERMISSION PART
export const checkSubscriptionService = (payload) => {
    const app_prefix = global.app_prefix;
    // const api = axios.create({baseURL: 'https://0nyd82mybh.execute-api.us-east-1.amazonaws.com/'});
    const api = axios.create({baseURL: ENV_CHECK_SUBSCRIPTION});
    return new Promise((resolve, reject) => {
        api(`dev/subscription`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: payload,
        })
            .then(async (res) => {
                console.log('subscription res ==> ', res.data);
                if (res.data?.status === 'ACTIVE') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const checkPermissionService = (payload) => {
    const app_prefix = global.app_prefix;
    let {current_user_id, hierchy_mode, policy_id} = payload;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/user_policy_summary/${current_user_id}?parents=${hierchy_mode}&policy_id=${policy_id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                // console.log('micro app data ==> ', res.data)
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const getListClassService = (payload, search = '', page = 1) => {
    let api = axios.create({baseURL: 'https://0nyd82mybh.execute-api.us-east-1.amazonaws.com/dev/objectmapper'});
    let pageQuery = `${payload?.data_mapping_string}&_url=${payload.base_url}?page=${page}`;
    let searchQuery = `${payload?.data_mapping_string}&_url=${payload.base_url}?search=${search}`;
    let query = Boolean(search) ? searchQuery : pageQuery;
    // let query = `${payload?.data_mapping_string}&_url=${payload.base_url}?search=生命&page=${page}`;
    console.log('query ==> ', query)
    return new Promise((resolve, reject) => {
        api.get(`?${query}`).then(res => {
            let {data, headers} = res;
            let custom_header = JSON.parse(headers['x-custom-header']);
            // console.log('get list class ===> ', data, custom_header);
            resolve({
                data,
                total_page: custom_header['x-wp-totalpages']
            })
        }).catch(err => {
            console.log('get list class error ==> ', err);
            reject(err);
        })
    })

};
