import React, {Component, useEffect, useRef, useState} from 'react';
import {Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import RNFetchBlob from 'rn-fetch-blob';
import _ from 'lodash';
import * as Actions from '../../../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import {Button, Icon, Image, ListItem} from 'react-native-elements';
import noImage from '../../../../../assets/images/no-image.jpg';
import {FAB} from 'react-native-paper';
import {makeImageUri, timeToSeconds} from '../../../../../services/common';
import PlaylistItem from '../../components/PlaylistItem';
import {useAppSettingsState} from '../../../../../context/AppSettingsContext';
import TrackPlayer from 'react-native-track-player';
// import {globalStyle} from '../../../../../assets/style';

function AlbumDetails(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const playlistData = useSelector(({playlistData}) => playlistData);
    const dialogState = useSelector(({dialogState}) => dialogState);
    const network = useSelector(({network}) => network);
    const [album, setAlbum] = useState(null);
    const [mylibrary, setMylibrary] = useState({});

    const [downloading, setDownloading] = useState(false);
    const [loadingLib, setLoadingLib] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        ref.current = true;
        return () => ref.current = null;
    }, []);

    const loadMyLibrary = async () => {
        setLoadingLib(true);
        let curLib = await AsyncStorage.getItem('mylibrary');
        if (ref.current && curLib !== null && curLib !== undefined) {
            setMylibrary(JSON.parse(curLib));
        }
        setLoadingLib(false);
    };

    useEffect(() => {
        loadMyLibrary();
        let params = props.route.params;
        setAlbum(params);
        dispatch(Actions.getPlaylistAction(params._id));
    }, []);

    // play from item
    const playFrom = async (item) => {
        if (!network.isConnected && mylibrary[item.playlist._id] === undefined) {
            Alert.alert('Please download the media with internet if you want to access this track offline.');
            return;
        }
        const currentTrack = await TrackPlayer.getCurrentTrack();
        console.log('currentTrack ===> ', currentTrack)
        if (currentTrack !== null) {
            await TrackPlayer.stop();
            await TrackPlayer.reset();
            // await TrackPlayer.destroy();
        }

        let dState = currentTrack ? 1 : 0;
        dispatch(Actions.setStartSongAction({id: item.playlist._id, position: 0}));
        dispatch(Actions.setPlayModeAction('ITEM'));
        await startPlay(dState);
    };

    // play list
    const onPlay = async () => {
        dispatch(Actions.setPlayModeAction('LIST'));
        if (dialogState.format === 'MP3') {
            await startPlay();
        } else {
            await startVideoPlay();
        }
    };

    const startVideoPlay = async () => {
        // dispatch(Actions.setFormattedListAction(formattedList));
        await formatList();
        dispatch(Actions.setDialogStateAction(0));
    };

    const startPlay = async (dState = 0) => {
        /*let formattedList = [];
        let curLib = JSON.parse(await AsyncStorage.getItem('mylibrary'));

        playlistData.data.forEach((item) => {
            let tmp = {};
            if (curLib !== null && curLib !== undefined) {
                let flag = curLib[item.playlist._id] !== undefined;
                tmp = {
                    id: item.playlist._id,
                    url: flag ? curLib[item.playlist._id].url : item.playlist.data.url,
                    title: item.playlist.data.title,
                    artist: item.users[0].data.full_name,
                    description: item.playlist.data.description,
                    artwork: flag ? makeImageUri(curLib[item.playlist._id].artwork) : item.playlist.data.picture,
                    duration: timeToSeconds(item.playlist.data.duration_string),
                };
            } else {
                tmp = {
                    id: item.playlist._id,
                    url: item.playlist.data.url,
                    title: item.playlist.data.title,
                    artist: item.users[0].data.full_name,
                    description: item.playlist.data.description,
                    artwork: item.playlist.data.picture,
                    duration: timeToSeconds(item.playlist.data.duration_string),
                };
            }
            formattedList.push(tmp);
        });
        dispatch(Actions.setFormattedListAction(formattedList));*/

        await formatList();
        dispatch(Actions.setDialogStateAction(dState));
        // dispatch(Actions.setDialogStateAction(0));
    };

    const formatList = async () => {
        let formattedList = [];
        let curLib = JSON.parse(await AsyncStorage.getItem('mylibrary'));

        playlistData.data.forEach((item) => {
            // console.log('****************************************', item)
            let tmp = {};
            if (curLib !== null && curLib !== undefined) {
                let flag = curLib[item.playlist._id] !== undefined;
                tmp = {
                    id: item.playlist._id,
                    url: flag ? curLib[item.playlist._id].url : item.playlist.data.url,
                    title: item.playlist.data.title,
                    artist: item.users[0]?.data.full_name || '',
                    description: item.playlist.data.description,
                    artwork: flag ? makeImageUri(curLib[item.playlist._id].artwork) : item.playlist.data.picture,
                    duration: timeToSeconds(item.playlist.data.duration_string),
                    web_links: Boolean(item.playlist?.data?.web_links) ? [...item.playlist?.data?.web_links] : [],
                };
            } else {
                tmp = {
                    id: item.playlist._id,
                    url: item.playlist.data.url,
                    title: item.playlist.data.title,
                    artist: item.users[0]?.data.full_name || '',
                    description: item.playlist.data.description,
                    artwork: item.playlist.data.picture,
                    duration: timeToSeconds(item.playlist.data.duration_string),
                    web_links: Boolean(item.playlist?.data?.web_links) ? [...item.playlist?.data?.web_links] : [],
                };
            }
            // console.log('tmp ====> ', tmp, item, item.playlist.data.duration_string, timeToSeconds(item.playlist.data.duration_string))
            formattedList.push(tmp);
        });
        dispatch(Actions.setFormattedListAction(formattedList));
    };

    const downloadMedia = async (item) => {
        let tmp = {...downloading};
        tmp[item.playlist._id] = true;
        setDownloading({...tmp});

        /*await RNFetchBlob.session('music').dispose();
        await RNFetchBlob.session('image').dispose();
        let savedMusic = await RNFetchBlob.session('music').list();
        let savedImage = await RNFetchBlob.session('image').list();
        console.log('download ===> ', item, savedImage, savedMusic);*/
        // await AsyncStorage.removeItem('mylibrary');

        let fetchRes = await RNFetchBlob.config({
            fileCache: true,
        }).fetch('GET', item.playlist.data.url);
        RNFetchBlob.session('music').add(fetchRes.path());
        // fetchRes.flush();
        let fetchImage = await RNFetchBlob.config({
            fileCache: true,
        }).fetch('GET', item.playlist.data.picture);
        RNFetchBlob.session('image').add(fetchImage.path());
        // fetchImage.flush();
        let mylibrary = {};
        mylibrary[item.playlist._id] = {
            url: fetchRes.path(),
            artwork: fetchImage.path(),
            id: item.playlist._id,
            title: item.playlist.data.title,
            artist: item.users[0]?.data.full_name || '',
            description: item.playlist.data.description,
            duration: timeToSeconds(item.playlist.data.duration_string),
        };
        let curLib = await AsyncStorage.getItem('mylibrary');
        if (curLib === undefined || curLib === null) {
            await AsyncStorage.setItem('mylibrary', JSON.stringify(mylibrary));
        } else {
            let tmp = JSON.parse(curLib);
            tmp[item.playlist._id] = {
                url: fetchRes.path(),
                artwork: fetchImage.path(),
                id: item.playlist._id,
                title: item.playlist.data.title,
                artist: item.users[0]?.data.full_name || '',
                description: item.playlist.data.description,
                duration: timeToSeconds(item.playlist.data.duration_string),
                format: dialogState.format,
            };
            await AsyncStorage.setItem('mylibrary', JSON.stringify(tmp));
        }
        loadMyLibrary();
        setDownloading(prev => ({
            ...prev,
            [item.playlist._id]: false,
        }));
    };

    if (playlistData.loading || loadingLib || !album) {
        return <LoadingSpinner
            title={playlistData.loading ? 'Loading songs ...'
                : loadingLib ?
                    'Loading Library ...'
                    : album && 'Empty album ...'}
        />;
    } else if (playlistData.data.length === 0) {
        return (
            <View style={styles.nodataView}>
                <Text>Details</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View>
                    <Image
                        source={album.data === undefined || album.data.picture === ''
                            ? noImage
                            : {uri: album.data.picture}}
                        style={styles.imageContainer}
                    />
                    <FAB
                        style={{...styles.fab, backgroundColor: globalStyle?.primary_color_2}}
                        color={'white'}
                        small={false}
                        animated
                        icon={'play'}
                        onPress={() => onPlay()}
                    />
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{album.data.title || ''}</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{album.data.description}</Text>
                </View>
                <>
                    {
                        playlistData.data.map((item, index) => {
                            // console.log('========itemmmmm====> ', item)
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => playFrom(item)}
                                >
                                    <PlaylistItem
                                        item={item}
                                        downloading={downloading}
                                        downloadMedia={() => downloadMedia(item)}
                                        downloaded={Boolean(mylibrary[item.playlist._id] !== undefined)}
                                    />
                                </TouchableOpacity>
                            );
                        })
                    }
                </>
                {/*<FlatList
                data={playlistData.data}
                renderItem={renderListItem}
                keyExtractor={item => item.playlist._id}
            />*/}
            </ScrollView>
            {/*<FAB
                style={{...styles.fab, backgroundColor: globalStyle?.primary_color_2}}
                color={'white'}
                small={false}
                animated
                icon={'play'}
                onPress={() => onPlay()}
            />*/}
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingVertical: 20,
            paddingHorizontal: 0,
        },
        nodataView: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        albumContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageContainer: {
            marginTop: 10,
            width: '100%',
            height: 260,
        },
        titleContainer: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 5,
            paddingHorizontal: 5,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: globalStyle?.black,
            textAlign: 'center',
        },
        descriptionContainer: {
            paddingVertical: 10,
            paddingHorizontal: 5,
        },
        description: {
            fontSize: 16,
            color: globalStyle?.gray_tone_1,
        },
        listImage: {
            width: 50,
            height: 50,
        },
        fab: {
            position: 'absolute',
            right: 10,
            // top: 260,
            bottom: -25,
        },
    });
};

export default AlbumDetails;
