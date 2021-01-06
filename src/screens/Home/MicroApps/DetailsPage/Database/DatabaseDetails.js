import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import NoData from '../../../../../components/NoData';
import {useSelector} from 'react-redux';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import {normalizeKey} from '../../../../../services/common';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

export default function DatabaseDetails({navigation, route}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const [item, setItem] = useState(null);
    const appStatus = useSelector(({appStatus}) => appStatus);

    useEffect(() => {
        if (route?.params?.item) {
            setItem(route.params.item);
        }
    }, [route]);

    const moreDetails = (obj) => {
        navigation.navigate('ObjectDetails', {
            obj,
        });
    };

    const viewObject = (_id) => {
        navigation.navigate('ObjectDetails', {
            _id,
        });
    };

    String.prototype.includeId = function () {
        return this.includes('_id');
    };

    if (appStatus.loading) {
        return <LoadingSpinner/>;
    }

    if (!item) {
        return <NoData/>;
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                _.map(item.data, (value, key) => {
                    if (key[0] !== '_') {
                        return (
                            <React.Fragment key={key}>
                                <ListItem.Title style={styles.title}>{normalizeKey(key)}</ListItem.Title>
                                {
                                    key.includeId() ?
                                        <TouchableOpacity onPress={() => viewObject(value)}>
                                            <ListItem.Subtitle
                                                style={styles.sutTitle}>{`1 Relation`}</ListItem.Subtitle>
                                        </TouchableOpacity>
                                        :
                                        typeof value === 'object' ?
                                            <TouchableOpacity onPress={() => moreDetails(value)}>
                                                <ListItem.Subtitle
                                                    style={styles.sutTitle}>{`${_.size(value)} attributes { ... }`}</ListItem.Subtitle>
                                            </TouchableOpacity>
                                            :
                                            <ListItem.Subtitle
                                                style={styles.sutTitle}>{`"${value}"`}</ListItem.Subtitle>
                                }
                            </React.Fragment>
                        );
                    }
                })
            }
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 20,
        },
        sutTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: globalStyle.black,
        },
        title: {
            fontSize: 14,
            paddingTop: 5,
            paddingBottom: 10,
            color: globalStyle.gray_tone_1
        },
    })
};
