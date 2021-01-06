import React, {Component, useEffect, useRef, useState} from 'react';
import {Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingLibrary from '../../components/LoadingLibrary';
import {DATA, makeImageUri, secondsToTime} from '../../../../../services/common';
import {Button, Icon, Image, ListItem} from 'react-native-elements';
// import {globalStyle} from '../../../../../assets/style';
import {useDispatch} from 'react-redux';
import human from 'human-time';
import lodash from 'lodash';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

function AlbumHistory(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const [albumHistory, setHistory] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        ref.current = true;
        return () => ref.current = null;
    }, []);

    useEffect(() => {
        const loadFromStorage = async () => {
            setLoading(true);
            let curLib = await AsyncStorage.getItem('albumHistory');
            if (ref.current && curLib !== null && curLib !== undefined) {
                setHistory(JSON.parse(curLib));
            }
            setLoading(false);
        };
        loadFromStorage();
    }, []);

    const onDelete = async (item, index) => {
        setDeleting(true);
        let curHistory = [...albumHistory];
        curHistory.splice(index, 1);
        await AsyncStorage.setItem('albumHistory', JSON.stringify(curHistory));
        setHistory(curHistory);
        setDeleting(false);
    };

    const renderLoading = ({item}) => (
        <LoadingLibrary/>
    );
    if (loading) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <FlatList
                    data={DATA}
                    renderItem={renderLoading}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            </SafeAreaView>
        );
    }

    if (albumHistory.length === 0) {
        return (
            <View style={styles.nodataView}>
                <Text>
                    No Items
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {
                    lodash.sortBy(albumHistory, ['playedTime'], ['asc']).reverse().map((item, index) => {
                        return (
                            <TouchableOpacity key={index} /*onPress={() => playFrom(item)}*/>
                                <ListItem bottomDivider={true} containerStyle={{paddingVertical: 5}}>
                                    <Image
                                        source={{uri: item.artwork}}
                                        style={styles.listImage}
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title numberOfLines={3}>{item.title}</ListItem.Title>
                                        <ListItem.Subtitle
                                            style={{fontSize: 12}}>{item.artist}</ListItem.Subtitle>
                                        <ListItem.Subtitle
                                            style={{fontSize: 12}}>
                                            {/*{item.playedTime}*/}
                                            {human((Date.now() - (new Date(item.playedTime)).getTime()) / 1000)}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>

                                    <View>
                                        <Text style={{
                                            fontSize: 12,
                                            color: globalStyle?.gray_tone_1,
                                        }}>{secondsToTime(item.position) + " played"}</Text>
                                    </View>
                                    <Button
                                        icon={
                                            <Icon
                                                name='trash-o'
                                                type='font-awesome'
                                                size={20}
                                                color={globalStyle?.gray_tone_2}
                                            />
                                        }
                                        loading={deleting}
                                        type={'clear'}
                                        containerStyle={{borderRadius: 20, marginRight: -10}}
                                        onPress={() => onDelete(item, index)}
                                    />
                                </ListItem>
                            </TouchableOpacity>
                        );
                    })
                }

            </ScrollView>
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: 20,
            backgroundColor: '#fff',
        },
        listImage: {
            width: 70,
            height: 70,
        },
        nodataView: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
};

export default AlbumHistory;
