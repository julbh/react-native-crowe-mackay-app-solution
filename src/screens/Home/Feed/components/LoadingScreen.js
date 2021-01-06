import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Card} from 'react-native-elements';

export default function LoadingScreen() {

    return (
        <Card containerStyle={{borderRadius: 6, marginBottom: -6}}>
            <SkeletonPlaceholder>
                <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                    <View style={{width: 45, height: 45, borderRadius: 50}}/>
                    <View style={{marginLeft: 20, width: '100%'}}>
                        <View style={{width: '30%', height: 16, borderRadius: 4}}/>
                        <View
                            style={{
                                marginTop: 6,
                                width: '50%',
                                height: 12,
                                borderRadius: 4,
                            }}
                        />
                    </View>
                </View>
                <View
                    style={{marginTop: 6, flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
                    <View style={{marginTop: 6, width: '100%', height: 200, borderRadius: 4}}/>
                    <View style={{marginTop: 12, width: '90%', height: 16, borderRadius: 4}}/>
                    <View style={{marginTop: 6, width: '40%', height: 16, borderRadius: 4}}/>
                    <View style={{marginTop: 6, width: '80%', height: 16, borderRadius: 4}}/>
                    <View style={{marginTop: 12, width: '20%', height: 12, borderRadius: 4}}/>
                </View>
            </SkeletonPlaceholder>
        </Card>
    );
};
