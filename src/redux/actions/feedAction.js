import {getFeedService} from '../../services/feed';
import {FETCH_FEED_ERROR, FETCH_FEED_REQUEST, FETCH_FEED_SUCCESS, SET_FEED_DATA} from '../constants/feedConstants';

export const getFeedAction = () => {
    return (dispatch, getState) => {
        dispatch({type: FETCH_FEED_REQUEST});
        getFeedService().then((res) => {
            dispatch({type: FETCH_FEED_SUCCESS, data: res});
        }).catch(error => {
            dispatch({type: FETCH_FEED_ERROR, error: error});
        });
    };
};

export const setFeedAction = (feeds) => {
    return (dispatch, getState) => {
        dispatch({type: SET_FEED_DATA, data: feeds});
    };
};
