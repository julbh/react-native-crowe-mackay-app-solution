import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BackHeader from '../../../../components/BackHeader';

export default function DeeplinkDetailsHeader({navigation, route, title}) {

    const dispatch = useDispatch();
    let parents = useSelector(({ microAppData }) => microAppData.parents);

    const onBack = () => {
        // navigation.goBack();
        console.log('navi ==> ', navigation, route)
        navigation.navigate('MicroApp')
        /*let curParents = [...parents];
        curParents.pop();
        dispatch({ type: SET_MICRO_APP_DATA, data: curParents });*/
    };

    return <BackHeader title={title} goBack={onBack} />
}
