import axios from 'axios';
import {
    // app_prefix,
    BASE_URL, BEAMS_INSTANCE_ID, BEAMS_SECRET_KEY, CHANNELS_APP_CLUSTER,
    CHANNELS_APP_ID,
    CHANNELS_APP_KEY,
    CHANNELS_APP_SECRET,
    SUBSCRIBE_TO_CHANNEL,
    X_API_KEY,
} from '../../config';

const apiBase = axios.create({baseURL: BASE_URL});

const channel_meta = {
    appId: CHANNELS_APP_ID,
    key: CHANNELS_APP_KEY,
    secret: CHANNELS_APP_SECRET,
    cluster: CHANNELS_APP_CLUSTER,
};

const beam_meta = {
    instanceId: BEAMS_INSTANCE_ID,
    secretKey: BEAMS_SECRET_KEY,
};

export const sendMessageService = (data) => {
    const app_prefix = global.app_prefix;
    console.log('sendMessageService ==> ', data)
    let user_ids = data.channel_payload._user_ids
        .filter(o => o !== data.channel_payload.user._id)
        .map(o => `debug-${o}`);
    const beam_data = {
        beam_meta,
        beam_interests: user_ids,
        beam_payload: {
            apns: {
                aps: {
                    alert: {
                        title: data.channel_payload?.user.name,
                        body: data.channel_payload?.text,
                        tag: JSON.stringify(data),
                        icon: data.channel_payload.user?.avatar,
                    },
                    badge: 12,
                },
                'Simulator Target Bundle': 'ca.crowemackay.conference',
                link: `croweappsolution://chat/${data.channel_payload?.channel}`,
                // link: `croweconference://chat/${JSON.stringify(data)}`
            },
            fcm: {
                priority: 'high',
                notification: {
                    title: data.channel_payload.user?.name,
                    body: data.channel_payload?.text,
                    tag: JSON.stringify(data),
                    icon: data.channel_payload.user?.avatar,
                },
                data: {
                    link: `croweappsolution://chat/${data.channel_payload?.channel}`,
                    // link: `croweconference://chat/${JSON.stringify(data)}`
                },
            },
        },
    };
    console.log('payload -====> ', beam_data, channel_meta, data)
    return new Promise((resolve, reject) => {
        apiBase(`dev/pusher/trigger`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: {
                ...data,
                prefix: app_prefix,
                channel_meta,
                ...beam_data,
            },
        })
            .then((res) => {
                console.log('send message res ==> ', res)
                resolve(res);
            })
            .catch(err => {
                console.log('send message error ==> ', err)
                reject(err);
            });
    });
};

// data = { event, channel, user_id }

export const getChatHistoryService = (data) => {
    const app_prefix = global.app_prefix;
    let url = `dev/db/${app_prefix}pusher?data.event=${data.event}&data.channel=${data.channel}`;
    return new Promise((resolve, reject) => {
        apiBase(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                let resData = res.data;
                let historyResult = [];
                if (data.channel !== SUBSCRIBE_TO_CHANNEL) {
                    for (let history of resData) {
                        try {
                            let tmp = {
                                ...history.data.channel_payload,
                                createdAt: new Date(history.data.channel_payload.composedAt),
                                hId: history._id,
                            };
                            historyResult.push(tmp);
                        } catch (e) {
                        }
                    }
                } else if (data.channel === SUBSCRIBE_TO_CHANNEL) {
                    for (let history of resData) {
                        if (history.data.channel_payload._user_ids.includes(data.user_id)) {
                            historyResult.push(history);
                        }
                    }
                }
                resolve(historyResult);
                // resolve(res)
            })
            .catch(err => {
                reject(err);
            });
    });
};

export const updateHistoryService = (_id, data) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiBase(`dev/db/${app_prefix}pusher/${_id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
            data: {
                ...data,
                channel_meta,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
};
