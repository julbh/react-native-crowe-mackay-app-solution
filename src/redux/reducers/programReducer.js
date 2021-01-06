import {FETCH_PRO_ERROR, FETCH_PRO_REQUEST, FETCH_PRO_SUCCESS} from '../constants/programConstants';

const initialState = {
    loading: false,
    program: [],
    error: null
}

export const programReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRO_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_PRO_SUCCESS:
            return {
                ...state,
                loading: false,
                program: action.data,
            }
        case FETCH_PRO_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            }
        default:
            return state;
    }
}
