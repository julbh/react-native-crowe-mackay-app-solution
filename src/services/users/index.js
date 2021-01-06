import axios from 'axios';
import { BASE_URL, X_API_KEY} from '../../config';

let apiEnd = axios.create({baseURL: BASE_URL});

export const getUserById = (id) => {
    const app_prefix = global.app_prefix;
    return new Promise((resolve, reject) => {
        apiEnd(`dev/db/${app_prefix}users/${id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': X_API_KEY
            },
        })
            .then((res) => {
                // console.log(res);
                resolve(res)
            })
            .catch(err => {
                console.log(err);
                reject(err)
            })
    })
};
