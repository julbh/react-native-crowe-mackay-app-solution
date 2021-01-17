import {GET_INBOX_ERR, GET_INBOX_REQ, GET_INBOX_SUC, SET_INBOX_DATA} from '../constants/inboxConstants';
import {getInboxService} from '../../services/inbox';
import _ from 'lodash';

export const getInboxAction = (user_id) => {
    return (dispatch, getState) => {
        dispatch({type: GET_INBOX_REQ});
        getInboxService(user_id).then((res) => {
            let sortedInbox = _.orderBy(res,  ['createdAt'], ['desc']);
            dispatch({type: GET_INBOX_SUC, data: sortedInbox});
        }).catch(error => {
            dispatch({type: GET_INBOX_ERR, data: error});
        })
        /*getInboxService().then((res) => {
            let sortedInbox = _.orderBy(res,  ['createdAt'], ['desc']);
            dispatch({type: SET_INBOX_DATA, data: sortedInbox});
        }).catch(error => {
            dispatch({type: SET_INBOX_DATA, data: []});
        })*/
    }
};

export const setInboxAction = (inboxData) => {
    return (dispatch, getState) => {
        dispatch({type: SET_INBOX_DATA, data: inboxData});
    }
};
