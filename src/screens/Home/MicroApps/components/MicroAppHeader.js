import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_MICRO_APP_DATA } from '../../../../redux/constants/microAppConstants';
import BackHeader from '../../../../components/BackHeader';

export default function MicroAppHeader() {

    const dispatch = useDispatch();
    let parents = useSelector(({ microAppData }) => microAppData.parents);

    const onBack = () => {
        let curParents = [...parents];
        curParents.pop();
        dispatch({ type: SET_MICRO_APP_DATA, data: curParents });
    };

    return <BackHeader goBack={onBack}/>
}
