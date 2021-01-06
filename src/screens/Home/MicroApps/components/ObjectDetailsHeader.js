import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BackHeader from '../../../../components/BackHeader';

export default function ObjectDetailsHeader({navigation, route}) {

    const dispatch = useDispatch();
    let parents = useSelector(({ microAppData }) => microAppData.parents);

    const onBack = () => {
        navigation.goBack();
        /*let curParents = [...parents];
        curParents.pop();
        dispatch({ type: SET_MICRO_APP_DATA, data: curParents });*/
    };

    return <BackHeader goBack={onBack} />
}
