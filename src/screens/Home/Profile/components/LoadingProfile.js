import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function LoadingProfile() {
    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <SkeletonPlaceholder>
                <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 20}}>
                    <View style={{width: 100, height: 100, borderRadius: 50}}/>
                    <View style={{marginTop: 20, alignItems: 'center'}}>
                        <View style={{width: 150, height: 20, borderRadius: 4}}/>
                        <View
                            style={{marginTop: 6, width: 250, height: 15, borderRadius: 4}}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30, paddingLeft: 20}}>
                    <View style={{width: 40, height: 40}}/>
                    <View style={{marginLeft: 20}}>
                        <View style={{width: 120, height: 20, borderRadius: 4}}/>
                        <View
                            style={{marginTop: 6, width: 80, height: 15, borderRadius: 4}}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingLeft: 20}}>
                    <View style={{width: 40, height: 40}}/>
                    <View style={{marginLeft: 20}}>
                        <View style={{width: 120, height: 20, borderRadius: 4}}/>
                        <View
                            style={{marginTop: 6, width: 240, height: 15, borderRadius: 4}}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingLeft: 20}}>
                    <View style={{width: 40, height: 40}}/>
                    <View style={{marginLeft: 20}}>
                        <View style={{width: 280, height: 160, borderRadius: 4}}/>
                        <View
                            style={{marginTop: 6, width: 180, height: 15, borderRadius: 4}}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingLeft: 20}}>
                    <View style={{width: 40, height: 40}}/>
                    <View style={{marginLeft: 20}}>
                        <View style={{width: 100, height: 20, borderRadius: 4}}/>
                        <View
                            style={{marginTop: 6, width: 160, height: 15, borderRadius: 4}}
                        />
                    </View>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};
