import axios from 'axios';
import {BASE_URL, X_API_KEY} from '../../config';

let apiEnd = axios.create({baseURL: BASE_URL});

const getPermissionName = (permission) => {
    if (permission !== 'FULL') {
        return 'PARTNERS_CONFERENCE';
    } else {
        return null;
    }
};

export const getPrograms = (permission) => {
    const app_prefix = global.app_prefix;
    let query = '';
    let permissionName = getPermissionName(permission);
    if (permissionName) {
        query = `?data.conference!=${permissionName}`;
    }
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}agendas${query}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                let resAgendas = res.data;
                let agenda = [];
                for (let resAgenda of resAgendas) {
                    if(resAgenda.data.is_hidden === undefined || !resAgenda.data.is_hidden){
                        let agendaInfo = resAgenda;
                        let userInfo = [];
                        let ids = resAgenda.data.user_ids;
                        if (ids !== undefined) {
                            // console.log('user ids ==> ', ids, ids.length, ids[0], ids[0] !== '')
                            if (ids.length === 1 && ids[0] !== '') {
                                try {
                                    let res = await apiEnd(`dev/db/users/${ids[0]}`, {
                                        method: 'get',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-api-key': X_API_KEY,
                                        },
                                    });
                                    agendaInfo.userInfo = [res.data];
                                } catch (e) {
                                    console.log('get user error ==> ', e);
                                }
                            } else if (ids.length > 1) {
                                let query = ids.join(',');
                                try {
                                    let res = await apiEnd(`dev/db/users?_id=${query}`, {
                                        method: 'get',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-api-key': X_API_KEY,
                                        },
                                    });
                                    agendaInfo.userInfo = res.data;
                                } catch (e) {
                                    console.log('get user error ==> ', e);
                                }
                            }
                            agenda.push(agendaInfo);
                        }
                    }
                }
                resolve(agenda);
            })
            .catch(err => {
                console.log('agenda==> ', err);
                reject(err);
            });
    });
};

export const getProgramsByUrl = (fetch_collection) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev${fetch_collection}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY,
            },
        })
            .then(async (res) => {
                let resAgendas = res.data;
                let agenda = [];
                for (let resAgenda of resAgendas) {
                    if(resAgenda.data.is_hidden === undefined || !resAgenda.data.is_hidden){
                        let agendaInfo = resAgenda;
                        let userInfo = [];
                        let ids = resAgenda.data.user_ids;
                        if (ids !== undefined) {
                            // console.log('user ids ==> ', ids, ids.length, ids[0], ids[0] !== '')
                            if (ids.length === 1 && ids[0] !== '') {
                                try {
                                    let res = await apiEnd(`dev/db/users/${ids[0]}`, {
                                        method: 'get',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-api-key': X_API_KEY,
                                        },
                                    });
                                    agendaInfo.userInfo = [res.data];
                                } catch (e) {
                                    console.log('get user error ==> ', e);
                                }
                            } else if (ids.length > 1) {
                                let query = ids.join(',');
                                try {
                                    let res = await apiEnd(`dev/db/users?_id=${query}`, {
                                        method: 'get',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-api-key': X_API_KEY,
                                        },
                                    });
                                    agendaInfo.userInfo = res.data;
                                } catch (e) {
                                    console.log('get user error ==> ', e);
                                }
                            }
                            agenda.push(agendaInfo);
                        }
                    }
                }
                resolve(agenda);
            })
            .catch(err => {
                console.log('agenda==> ', err);
                reject(err);
            });
    });
};

/*
export const getPrograms___ = () => {
    return new Promise((resolve, reject) => {
        axios(`${BASE_URL}agenda?_limit=100`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
*/
