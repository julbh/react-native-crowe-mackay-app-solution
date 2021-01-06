import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {globalStyle} from '../../../../../assets/style';

export default function ChatboxLoading() {

    return(
        <View style={{flex: 1, height: '100%', justifyContent: 'center', backgroundColor: '#fff'}}>
            <ActivityIndicator size="large" color={globalStyle.primary_color_2}/>
        </View>
    )
}
