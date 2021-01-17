import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Avatar,
    Button,
    Icon,
    Image,
    ListItem,
} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import TrackPlayer, {
    // useTrackPlayerProgress,
    usePlaybackState,
    useTrackPlayerEvents,
} from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTrackPlayerProgress} from 'react-native-track-player/lib/hooks';
import {useNetInfo} from '@react-native-community/netinfo';
import Slider from '@react-native-community/slider';
import {Paragraph, Dialog, Portal} from 'react-native-paper';
import moment from 'moment';
import _ from 'lodash';
import * as Actions from '../../redux/actions';
// import {globalStyle} from '../../assets/style';
import noImage from '../../assets/images/no-image.jpg';
import {secondsToTime, timeToSeconds} from '../../services/common';
import LoadingImage from './components/LoadingImage';
import BackHeader from '../../components/BackHeader';
import {WebView} from 'react-native-webview';
import LoadingSpinner from '../../components/LoadingSpinner';
import {addCounterService, updateCounterService} from '../../services/microApps/commonService';
import {useAppSettingsState} from '../../context/AppSettingsContext';
import {DIALOG_STATE} from '../../redux/constants/microAppConstants';
import LoadingTitle from './components/LoadingTitle';

const ProgressBar = () => {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const [sliderValue, setSliderValue] = useState(0);

    const [isSeeking, setIsSeeking] = useState(false);
    const {position, duration} = useTrackPlayerProgress(250);

    useEffect(() => {
        if (!isSeeking && position && duration) {
            setSliderValue(position / duration);
        }
    }, [position, duration]);

    const slidingStarted = () => {
        setIsSeeking(true);
    };

    const slidingCompleted = async value => {
        await TrackPlayer.seekTo(value * duration);
        setSliderValue(value);
        setIsSeeking(false);
    };

    let width = Platform.OS === 'android' ?
        Dimensions.get('window').width
        :
        Dimensions.get('window').width - 20;

    return (
        <>
            <View style={{alignItems: 'center'}}>
                <Slider
                    style={{width: width, height: 40}}
                    minimumValue={0}
                    maximumValue={1}
                    value={sliderValue}
                    minimumTrackTintColor="#111000"
                    maximumTrackTintColor="#000000"
                    thumbTintColor={globalStyle?.primary_color_2}
                    onSlidingStart={slidingStarted}
                    onSlidingComplete={slidingCompleted}
                />
            </View>
            <View style={{flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between'}}>
                <Text>{secondsToTime(position)}</Text>
                <Text>{secondsToTime(duration)}</Text>
            </View>
        </>
    );
};

const PLAYBACK_TRACK_CHANGED = 'playback-track-changed';
const PLAYBACK_QUEUE_ENDED = 'playback-queue-ended';
const REMOTE_NEXT = 'remote-next';
const REMOTE_PREVIOUS = 'remote-previous';
const REMOTE_PLAY = 'remote-play';
const REMOTE_PAUSE = 'remote-pause';
const REMOTE_STOP = 'remote-stop';

const events = [
    'playback-track-changed',
    'playback-queue-ended',
    // "remote-stop",
    // "remote-previous",
    // "remote-next",
    // "remote-pause",
    // "remote-play"
    // TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED,
    // TrackPlayer.TrackPlayerEvents.PLAYBACK_QUEUE_ENDED,
    // TrackPlayer.TrackPlayerEvents.REMOTE_NEXT,
    // TrackPlayer.TrackPlayerEvents.REMOTE_PREVIOUS,
    // TrackPlayer.TrackPlayerEvents.REMOTE_PLAY,
    // TrackPlayer.TrackPlayerEvents.REMOTE_PAUSE,
    // TrackPlayer.TrackPlayerEvents.REMOTE_JUMP_FORWARD,
    // TrackPlayer.TrackPlayerEvents.REMOTE_JUMP_BACKWARD,
    // TrackPlayer.TrackPlayerEvents.REMOTE_PREVIOUS,
    // TrackPlayer.TrackPlayerEvents.REMOTE_STOP,
];

const remoteEvents = [
    TrackPlayer.TrackPlayerEvents.REMOTE_PREVIOUS,
    // TrackPlayer.TrackPlayerEvents.REMOTE_JUMP_FORWARD,
    // TrackPlayer.TrackPlayerEvents.REMOTE_JUMP_BACKWARD,
    // TrackPlayer.TrackPlayerEvents.REMOTE_SKIP,
    TrackPlayer.TrackPlayerEvents.REMOTE_STOP,
];

function PlayScreen(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const dialogState = useSelector(({dialogState}) => dialogState);
    const playlistData = useSelector(({playlistData}) => playlistData);
    const userData = useSelector((rootReducer) => rootReducer.userData);
    const counterData = useSelector((rootReducer) => rootReducer.counterData);
    const network = useSelector(({network}) => network);
    const netInfo = useNetInfo();

    const [loading, setLoading] = useState(false);
    const {position, duration} = useTrackPlayerProgress(250);

    // console.log('{position, duration}', {position, duration})

    const [connected, setConnected] = useState(network.isConnected);
    const [visibleDlg, setVisibleDlg] = useState(false);

    const [readmore, setReadmore] = useState(false);

    const ref = useRef(null);

    ///////////////////
    const playbackState = usePlaybackState();
    const [trackTitle, setTrackTitle] = useState('');
    const [trackArtwork, setTrackArtwork] = useState();
    const [trackArtist, setTrackArtist] = useState('');
    const [trackDescription, setTrackDescription] = useState('');
    const [webLinks, setWebLinks] = useState([]);
    const [showWebView, setShowWebView] = useState(false);
    const [webUrl, setWebUrl] = useState('');
    const [counters, setCounters] = useState({});
    const [trackId, setTrackId] = useState('');

    useTrackPlayerEvents(events, async event => {
        if (event.type === PLAYBACK_TRACK_CHANGED) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const {title, artist, artwork, description, url, web_links} = track || {};
            setTrackTitle(title);
            setTrackArtist(artist);
            setTrackArtwork(artwork);
            setTrackDescription(description);
            setWebLinks(web_links);

            // let curId = await TrackPlayer.getCurrentTrack();
            setTrackId(event.nextTrack);

            // console.log(curId, event)

            if (event.track && event.position > 0) {
                await saveHistory(event.track, event.position);
            }
            if (connected !== network.isConnected && event.track) {
                await playFromStart();
            }
        } else if (event.type === PLAYBACK_QUEUE_ENDED && event.track) {
            await playFromStart();
        }
        setConnected(network.isConnected);
    });

    const saveHistory = async (trackId, position) => {
        let curTrack = await TrackPlayer.getCurrentTrack();
        if (curTrack) {
            let item = _.find(playlistData.data, o => o.playlist._id === trackId);
            let playedTime = moment().format('MM/DD/YYYY HH:mm:ss');
            if (item) {
                let tmp = {
                    hId: Date.now(),
                    id: item.playlist._id,
                    url: item.playlist.data.url,
                    title: item.playlist.data.title,
                    artist: item.users[0]?.data.full_name || '',
                    description: item.playlist.data.description,
                    artwork: item.playlist.data.picture,
                    duration: timeToSeconds(item.playlist.data.duration_string),
                    web_links: Boolean(item.playlist?.data?.web_links) ? [...item.playlist?.data?.web_links] : [],
                    position: position,
                    format: 'MP3',
                    playedTime,
                };
                let albumStorage = await AsyncStorage.getItem('albumHistory');
                let curAlbumHistory = JSON.parse(albumStorage);
                let findHistory = _.find(curAlbumHistory, ['id', tmp.id]);
                // await AsyncStorage.removeItem('albumHistory');
                if (findHistory === undefined) {
                    let history = JSON.parse(await AsyncStorage.getItem('albumHistory'));
                    if (history === undefined || history === null) {
                        await AsyncStorage.setItem('albumHistory', JSON.stringify([{...tmp}]));
                    } else {
                        let newHistory = [...history];
                        newHistory.push(tmp);
                        await AsyncStorage.setItem('albumHistory', JSON.stringify(newHistory));
                        // console.log('new history ===> ', newHistory);
                    }
                } else {
                    let newHistory = [];
                    curAlbumHistory.map(h => {
                        let tHis = {...h};
                        if (h.id === tmp.id) {
                            tHis = {
                                ...h,
                                ...tmp,
                            };
                        }
                        newHistory.push(tHis);
                    });
                    await AsyncStorage.setItem('albumHistory', JSON.stringify(newHistory));
                }
            }
        }
    };

    const playFromStart = async () => {
        if (network.isConnected) {
            await playRemoteFiles();
        } else {
            await playLocalFiles();
        }
    };

    ///////////////////

    // console.log('playlistData ===> ', counterData, userData, trackId);

    useEffect(() => {
        ref.current = true;
        return () => ref.current = null;
    }, []);

    useEffect(() => {
        // let query = `data.object_id=${event.track}`;
        // let query = ``;
        dispatch(Actions.getCountersAction(''));
    }, []);

    useEffect(() => {
        TrackPlayer.getCurrentTrack().then(curTrack => {
            console.log('audio player ==', curTrack);
            if (!curTrack) {
                setLoading(true);
                const initPlay = async () => {
                    await setup();
                    await togglePlayback();
                    setLoading(false);
                };
                initPlay();
            }
        }).catch(err => {
            console.log('audio player error ==> ', err);
        });
    }, [dialogState]);

    async function setup() {
        await TrackPlayer.setupPlayer({});
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
                // TrackPlayer.CAPABILITY_SEEK_TO,
                // TrackPlayer.CAPABILITY_SKIP,
                // TrackPlayer.CAPABILITY_JUMP_FORWARD,
                // TrackPlayer.CAPABILITY_JUMP_BACKWARD,
                // TrackPlayer.CAPABILITY_PLAY_FROM_ID,
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
        });
    }

    async function playLocalFiles() {
        let localList = playlistData.formattedList.filter(o => !o.url.includes('http'));
        if (localList.length === 0) {
            Alert.alert('There is no downloaded files!');
            return false;
        }
        await TrackPlayer.reset();
        await TrackPlayer.add(localList);
        await TrackPlayer.play();
        await TrackPlayer.setVolume(1);
    }

    async function playRemoteFiles() {
        try {
            console.log('play remote files ==> ', playlistData.formattedList);
            await TrackPlayer.reset();
            await TrackPlayer.add([...playlistData.formattedList]);
            await TrackPlayer.play();
            await TrackPlayer.setVolume(1);
        } catch (e) {
            console.log('error ==> ', e);
        }
    }

    async function togglePlayback() {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack == null) {
            if (dialogState.mode === 'LIST') {
                if (dialogState.start.id && dialogState.start.music_album_id === dialogState.album_id) {
                    setVisibleDlg(true);
                } else {
                    await playFromStart();
                }
            } else {
                await playFromStart();
                await TrackPlayer.skip(dialogState.start.id);
                await TrackPlayer.seekTo(dialogState.start.position);
            }
            setConnected(network.isConnected);
        } else {
            if (playbackState === TrackPlayer.STATE_PAUSED) {
                await TrackPlayer.play();
                setConnected(network.isConnected);
            } else {
                await TrackPlayer.pause();
                setConnected(network.isConnected);
            }
        }
    }

    async function skipToNext() {
        try {
            await TrackPlayer.skipToNext();
        } catch (_) {
        }
    }

    async function skipToPrevious() {
        try {
            await TrackPlayer.skipToPrevious();
        } catch (_) {
        }
    }

    const onDismiss = async () => {
        try {
            dispatch(Actions.setDialogStateAction(2));
            let curId = await TrackPlayer.getCurrentTrack();
            console.log('current id===> ', curId);
            let curTrack = await TrackPlayer.getTrack(curId);
            if (dialogState.mode !== 'DOWNLOADED') {
                await saveHistory(curId, position);
                let startInfo = {
                    ...curTrack,
                    position,
                    music_album_id: dialogState.album_id,
                };
                dispatch(Actions.setStartSongAction({...startInfo}));
            }
            await TrackPlayer.stop();
            await TrackPlayer.reset();
            await TrackPlayer.destroy();
            // dispatch(Actions.setDialogStateAction(2));
        } catch (e) {
            console.log('error ==> ', e);
        }
    };

    const onMaximize = () => {
        dispatch(Actions.setDialogStateAction(0));
    };

    const onMinimize = () => {
        dispatch(Actions.setDialogStateAction(1));
    };

    const okAction = async () => {
        setVisibleDlg(false);
        await playFromStart();
        await TrackPlayer.skip(dialogState.start.id);
        await TrackPlayer.seekTo(dialogState.start.position);
    };

    const cancelAction = async () => {
        setVisibleDlg(false);
        await playFromStart();
    };

    const delayedSubmit = useCallback(
        _.debounce(async e => {
            console.log('=========> ', counterData.data, e);
            let current_count = counterData.data.filter(o => (o.data.object_id === trackId) && (o.data.user_id === userData.data.user_id));
            console.log('current ===> ', current_count, trackId);
            try {
                if (current_count.length === 0) {
                    let data = {
                        object_id: trackId,
                        user_id: userData.data.user_id,
                        class: 'LIKES',
                    };
                    let countDa = [...counterData.data];
                    countDa.push({
                        _id: Date.now(),
                        createdAt: moment().toISOString(),
                        data: {...data},
                        type: 'counters',
                    });
                    console.log('count data new ==> ', countDa);
                    dispatch(Actions.setCountersAction(countDa));
                    await addCounterService(data);
                } else {
                    let class_data = current_count[0].data.class === 'LIKES' ? 'DISLIKES' : 'LIKES';
                    let data = {
                        ...current_count[0].data,
                        class: class_data,
                    };
                    let countDa = [];
                    for (let cData of counterData.data) {
                        if (current_count[0]?._id === cData._id) {
                            countDa.push({
                                ...cData,
                                data: {...data},
                            });
                        } else {
                            countDa.push(cData);
                        }
                    }
                    console.log('update ===> ', data);
                    dispatch(Actions.setCountersAction(countDa));
                    await updateCounterService(current_count[0]._id, data);
                }
                dispatch(Actions.getCountersAction(''));
            } catch (e) {
            }
        }, 500),
        [],
    );

    const handleChangeLike = async () => {
        // console.log('================================> ');
        //     counterData.data.filter(o => (o.data.object_id === trackId) && (o.data.user_id === userData.data.user_id) && (o.data.class === 'LIKES')));
        delayedSubmit();
    };

    if (showWebView) {
        return <SafeAreaView style={{...styles.fullScreen, padding: 0, paddingHorizontal: 0}}>
            <BackHeader goBack={() => setShowWebView(false)}/>
            <WebView
                source={{uri: webUrl}}
                // source={{uri: 'https://google.com'}}
                // domStorageEnabled={true}
                renderLoading={() => <LoadingSpinner/>}
                startInLoadingState={true}
            />
            {/*<NoData/>*/}
        </SafeAreaView>;
    } else {

        if (dialogState.state === 0) {
            return (
                <View style={styles.fullScreen}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{...styles.fTitleContainer, width: '100%'}}>
                            <Icon
                                name='chevron-down'
                                type='font-awesome'
                                color='#aaa'
                                size={24}
                                raised={true}
                                onPress={onMinimize}
                            />
                            <View style={{alignItems: 'center', justifyContent: 'center', width: '60%'}}>
                                {Boolean(trackTitle) ?
                                    <Text style={styles.fTitle}>{trackTitle || 'No Selected'}</Text>
                                    :
                                    <LoadingTitle style={{width: 200}}/>
                                }
                            </View>
                            <Icon
                                name='times'
                                type='font-awesome'
                                color='#aaa'
                                size={24}
                                raised={true}
                                onPress={onDismiss}
                            />
                        </View>


                        <View style={styles.fImageContainer}>
                            {playbackState === TrackPlayer.STATE_BUFFERING || playbackState === TrackPlayer.STATE_NONE || loading ?
                                <LoadingImage/>
                                :
                                <Image
                                    // source={{uri: 'https://assets.tcog.hk/0njz6jybdt.png'}}
                                    source={trackArtwork !== undefined ? {uri: trackArtwork} : noImage}
                                    style={styles.fImage}
                                />}
                        </View>

                        <View style={styles.fDescContainer}>
                            <Text numberOfLines={readmore ? null : 2}
                                  ellipsizeMode={readmore ? null : 'tail'}>{trackDescription || ''}</Text>
                            {Boolean(trackDescription) && <TouchableOpacity onPress={() => setReadmore(!readmore)}>
                                <Text
                                    style={{color: globalStyle?.primary_color_2}}>{readmore ? 'Less ...' : 'Read more ...'}</Text>
                            </TouchableOpacity>}
                        </View>

                        <View style={styles.extraContainer}>
                            <View>
                                <TouchableOpacity style={styles.likeContainer}
                                                  onPress={handleChangeLike}
                                >
                                    {
                                        counterData.data?.filter(o =>
                                            (o.data?.object_id === trackId)
                                            && (o.data?.user_id === userData.data?.user_id)
                                            && (o.data?.class === 'LIKES')).length > 0 ?
                                            <Icon name="heart" type="font-awesome"
                                                  color={globalStyle?.primary_color_2}/>
                                            :
                                            <Icon name="heart-o" type="font-awesome"
                                                  color={globalStyle?.primary_color_2}/>
                                    }
                                    <Text style={styles.counter}>
                                        {counterData.data?.filter(o => (o.data?.object_id === trackId) && (o.data?.class === 'LIKES'))?.length}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {Boolean(webLinks) && <View style={styles.iconArea}>
                                {webLinks.map((web_link, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.iconView}
                                            onPress={() => {
                                                setShowWebView(true);
                                                setWebUrl(web_link?.link);
                                                // props.navigation.navigate('WebViewScreen', {query: web_link?.link})
                                            }}
                                        >
                                            <Avatar
                                                source={{uri: web_link?.icon}}
                                                imageProps={{resizeMode: 'contain'}}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>}
                        </View>

                        <ProgressBar/>

                        <View
                            style={styles.fControllerContainer}
                        >
                            <Icon
                                name='skip-previous'
                                type='material-community'
                                color={globalStyle?.primary_color_2}
                                size={60}
                                containerStyle={{paddingHorizontal: 10}}
                                onPress={skipToPrevious}/>
                            <Icon
                                // name='play-circle'
                                name={(
                                    playbackState === TrackPlayer.STATE_PLAYING ||
                                    playbackState === TrackPlayer.STATE_BUFFERING)
                                    ? 'pause-circle' : 'play-circle'
                                }
                                type='material-community'
                                color={globalStyle?.primary_color_2}
                                size={90}
                                containerStyle={{paddingHorizontal: 10}}
                                onPress={togglePlayback}/>
                            <Icon
                                name='skip-next'
                                type='material-community'
                                color={globalStyle?.primary_color_2}
                                size={60}
                                containerStyle={{paddingHorizontal: 10}}
                                onPress={skipToNext}/>
                        </View>
                    </ScrollView>
                    <Portal>
                        <Dialog visible={visibleDlg} onDismiss={cancelAction}>
                            <Dialog.Title>Confirm</Dialog.Title>
                            <Dialog.Content>
                                <View style={styles.dialogInfo}>
                                    <Image
                                        source={{uri: dialogState.start.artwork}}
                                        style={styles.dImage}
                                    />
                                    <View style={{paddingHorizontal: 10}}>
                                        {
                                            dialogState.start.title !== undefined &&
                                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                                                {dialogState.start.title.length < 30 ?
                                                    dialogState.start.title
                                                    : `${dialogState.start.title.substring(0, 30)}...`}
                                            </Text>
                                        }
                                        <Text style={{fontSize: 14}}>{dialogState.start.artist}</Text>
                                        <Text style={{fontSize: 12, color: globalStyle?.gray_tone_1}}>
                                            {secondsToTime(dialogState.start.position) + ' / ' + secondsToTime(dialogState.start.duration)}
                                        </Text>
                                    </View>
                                </View>
                                <Paragraph style={{paddingTop: 20, fontSize: 16}}>Do you want to continue
                                    playing?</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={cancelAction}
                                        title={'Cancel'}
                                        buttonStyle={{
                                            marginRight: 10,
                                            paddingHorizontal: 10,
                                            width: 80,
                                            backgroundColor: 'grey',
                                        }}
                                />
                                <Button onPress={okAction} title={'OK'}
                                        buttonStyle={{
                                            paddingHorizontal: 10,
                                            width: 80,
                                            backgroundColor: globalStyle?.primary_color_2,
                                        }}
                                />
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            );
        } else if (dialogState.state === 1) {
            return (
                <View style={styles.miniScreen}>
                    <View style={styles.progress}>
                        <View style={{flex: position, backgroundColor: globalStyle?.primary_color_1}}/>
                        <View
                            style={{
                                flex: duration - position,
                                backgroundColor: globalStyle?.gray_tone_3,
                            }}
                        />
                    </View>
                    <TouchableOpacity onPress={onMaximize}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Image
                                // source={{uri: 'https://assets.tcog.hk/0njz6jybdt.png'}}
                                source={trackArtwork !== undefined ? {uri: trackArtwork} : noImage}
                                style={styles.mImage}
                            />
                            <View style={styles.miniContent}>
                                {Boolean(trackTitle) ? <Text
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: '#fff',
                                        }}>{trackTitle || 'No Selected'}</Text>
                                    :
                                    <LoadingTitle style={{width: 160, height: 15}}/>
                                }
                                {Boolean(trackArtist) ? <Text numberOfLines={2} ellipsizeMode='tail'
                                                              style={{
                                                                  color: '#fff',
                                                                  fontSize: 12,
                                                              }}>{trackArtist || 'No Selected'}</Text>
                                    :
                                    <LoadingTitle width={240} style={{width: 120, height: 10, marginTop: 5}}/>}
                            </View>
                            <View style={styles.mTimeArea}>
                                <Text style={{fontSize: 12, color: '#fff'}}>{secondsToTime(position) || ''}</Text>
                            </View>
                            <View
                                style={styles.mControllerContainer}
                            >
                                <Icon
                                    name={(
                                        playbackState === TrackPlayer.STATE_PLAYING ||
                                        playbackState === TrackPlayer.STATE_BUFFERING)
                                        ? 'pause-circle' : 'play-circle'
                                    }
                                    type='material-community'
                                    color={'#fff'}
                                    size={32}
                                    containerStyle={{paddingHorizontal: 5, paddingRight: 10}}
                                    onPress={togglePlayback}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

    }

}

function getStateName(state) {
    switch (state) {
        case TrackPlayer.STATE_NONE:
            return 'None';
        case TrackPlayer.STATE_PLAYING:
            return 'Playing';
        case TrackPlayer.STATE_PAUSED:
            return 'Paused';
        case TrackPlayer.STATE_STOPPED:
            return 'Stopped';
        case TrackPlayer.STATE_BUFFERING:
            return 'Buffering';
    }
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        miniScreen: {
            backgroundColor: globalStyle?.gray_tone_1,
            position: 'absolute',
            bottom: globalStyle?.miniBarMargin,
            width: '100%',
            color: '#fff',
            // height: 200,
        },
        fullScreen: {
            backgroundColor: '#fff',
            width: '100%',
            height: '100%',
            padding: 10,
            paddingHorizontal: 15,
        },
        fTitleContainer: {
            flexDirection: 'row',
            padding: 10,
            justifyContent: 'space-between',
        },
        fTitle: {
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
        },
        fImageContainer: {
            alignItems: 'center',
            paddingTop: 20,
        },
        fImage: {
            // width: 360,
            width: Dimensions.get('window').width,
            height: 300,
        },
        fDescContainer: {
            // height: 80,
            justifyContent: 'center',
            // alignItems: 'center',
        },
        fControllerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
        },

        miniContent: {
            width: '50%',
            // paddingHorizontal: 10,
            justifyContent: 'center',
        },
        mTimeArea: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        mImage: {
            width: globalStyle?.miniBarHeight,
            height: globalStyle?.miniBarHeight,
        },
        mDetailContainer: {
            alignItems: 'center',
            width: '50%',
            color: '#fff',
        },
        mControllerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            // backgroundColor: 'red'
        },
        progress: {
            height: 2,
            width: '100%',
            flexDirection: 'row',
        },
        dImage: {
            width: 70,
            height: 70,
        },
        dialogInfo: {
            display: 'flex',
            flexDirection: 'row',
        },
        iconArea: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        iconView: {
            padding: 5,
        },
        extraContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        likeContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            paddingVertical: 5,
        },
        counter: {
            paddingHorizontal: 5,
            color: globalStyle?.primary_color_2,
            fontSize: 12,
        },
    });
};

export default PlayScreen;
