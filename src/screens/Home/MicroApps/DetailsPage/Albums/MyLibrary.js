import React, { useEffect, useRef, useState} from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {useDispatch} from 'react-redux';
import LoadingLibrary from '../../components/LoadingLibrary';
import {DATA, makeImageUri, secondsToTime} from '../../../../../services/common';
import {Button, Icon, Image, ListItem} from 'react-native-elements';
// import {globalStyle} from '../../../../../assets/style';
import * as Actions from '../../../../../redux/actions';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

function MyLibrary(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const [mylist, setMylist] = useState([]);
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
            let curLib = await AsyncStorage.getItem('mylibrary');
            if (ref.current && curLib !== null && curLib !== undefined) {
                setMylist(JSON.parse(curLib));
            }
            setLoading(false);
        };
        loadFromStorage();
    }, []);

    const onDelete = async (item) => {
        setDeleting(true);
        let curLib = JSON.parse(await AsyncStorage.getItem('mylibrary'));
        delete curLib[item._id];
        await RNFetchBlob.session('music').remove(item.url);
        await RNFetchBlob.session('image').remove(item.artwork);
        await RNFetchBlob.fs.unlink(item.url);
        await RNFetchBlob.fs.unlink(item.artwork);
        await AsyncStorage.setItem('mylibrary', JSON.stringify(curLib));
        let savedMusic = await RNFetchBlob.session('music').list();
        let savedImage = await RNFetchBlob.session('image').list();
        setMylist(curLib);
        setDeleting(false);
    };

    const playFrom = async (item) => {
        let formattedList = [];
        for(let key in mylist){
            let tmp = {...mylist[key]};
            tmp.artwork = makeImageUri(tmp.artwork);
            formattedList.push(tmp);
        }
        console.log('download start ===> ', formattedList, item)
        dispatch(Actions.setDialogTypeAction(item.format, item._id));
        dispatch(Actions.setPlayModeAction("DOWNLOADED"));
        dispatch(Actions.setStartSongAction({id: item._id, position: 0}));
        dispatch(Actions.setFormattedListAction(formattedList));
        dispatch(Actions.setDialogStateAction(0));
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

    if (mylist.length === 0) {
        return (
            <View style={styles.nodataView}>
                <Text>
                    No Items
                </Text>
            </View>
        );
    }

    let list = [];
    for (let key in mylist) {
        let tmp = {...mylist[key], _id: key};
        list.push(tmp);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {
                    list.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => playFrom(item)}>
                                <ListItem bottomDivider={true} containerStyle={{paddingVertical: 5}}>
                                    <Image
                                        source={{uri: makeImageUri(item.artwork)}}
                                        style={styles.listImage}
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.title}</ListItem.Title>
                                        <ListItem.Subtitle
                                            style={{fontSize: 12}}>{item.artist}</ListItem.Subtitle>
                                    </ListItem.Content>

                                    <View>
                                        <Text style={{
                                            fontSize: 12,
                                            color: globalStyle?.gray_tone_1,
                                        }}>{secondsToTime(item.duration)}</Text>
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
                                        onPress={() => onDelete(item)}
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

export default MyLibrary;
