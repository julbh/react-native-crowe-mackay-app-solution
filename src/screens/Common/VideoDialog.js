import React, {Component, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    Button,
    Icon,
    Image,
    ListItem,
} from 'react-native-elements';
import {connect, useDispatch, useSelector} from 'react-redux';
import Video, {TextTrackType} from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import Orientation from 'react-native-orientation';
// import {globalStyle} from '../../assets/style';
import TrackPlayer from 'react-native-track-player';
import LoadingImage from './components/LoadingImage';
import noImage from '../../assets/images/no-image.jpg';
import {Dialog, Paragraph, Portal} from 'react-native-paper';
import {secondsToTime, timeToSeconds} from '../../services/common';
import {useTrackPlayerProgress} from 'react-native-track-player/lib/hooks';
import Slider from '@react-native-community/slider';
import * as Actions from '../../redux/actions';
import {bindActionCreators} from 'redux';
import {setDialogStateAction} from '../../redux/actions';
import _ from 'lodash';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppSettingsState} from '../../context/AppSettingsContext';

const ProgressBar = (props) => {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const {position, duration, videoPlayer} = props;
    console.log('{position, duration}', {position, duration})

    const [sliderValue, setSliderValue] = useState(0);

    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        if (!isSeeking && position && duration) {
            setSliderValue(position / duration);
        }
    }, [position, duration]);

    const slidingStarted = () => {
        setIsSeeking(true);
    };

    const slidingCompleted = async value => {
        videoPlayer.current.seek(value * duration);
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

const PLAYER_STATES = {
    PLAYING: 0,
    PAUSED: 1,
    ENDED: 2,
};

const videos = [
    'https://assets.tcog.hk/c552jtqyu3.mp4',
    // "https://assets.tcog.hk/c552jtqyu3.mp4",
    'https://assets.mixkit.co/videos/download/mixkit-countryside-meadow-4075.mp4',
];

function VideoDialog(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const videoPlayer = useRef(null);
    const playlistData = useSelector(({playlistData}) => playlistData);
    const network = useSelector(({network}) => network);
    const [connected, setConnected] = useState(network.isConnected);

    const [visibleDlg, setVisibleDlg] = useState(false);
    const [isVideoLoading, setVideoLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
    const [position, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [startPos, setStartPos] = useState(0);

    const [videoTracks, setTracks] = useState([]);

    const [currentVideoId, setVideo] = useState(0);

    const [isFullscreen, setFullScreen] = useState(false);

    const [readmore, setReadmore] = useState(false);

    useEffect(() => {
        // setVideoLoading(false);
        Orientation.addOrientationListener(_orientationDidChange);
        return () => {
            Orientation.removeOrientationListener(_orientationDidChange);
            Orientation.unlockAllOrientations();
        };
    }, []);

    const _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE') {
            // Orientation.unlockAllOrientations();
            onFullScreen();
        } else {
            // Orientation.unlockAllOrientations();
            onExitFull();
        }
    };

    useEffect(() => {
        setIsPlaying(false);
        if (props.dialogState.mode === 'LIST') {
            if (props.dialogState.start.id && props.dialogState.start.video_album_id === props.dialogState.album_id) {
                setVisibleDlg(true);
            } else {
                playFromStart();
            }
        } else {
            playFromStart();
        }
        // playFromStart();
    }, [props]);

    useEffect(() => {
        if (network.isConnected) {
            playRemoteFiles();
        } else {
            playLocalFiles();
        }
    }, [network.isConnected]);

    const saveHistory = async (position) => {
        console.log('%%%%%%%%%%%%%%%%%%%%%%', playlistData);
        // let curTrack = await TrackPlayer.getCurrentTrack();
        let curTrack = videoTracks[currentVideoId];
        if (curTrack !== null && curTrack !== undefined) {
            let item = _.find(playlistData.data, o => o.playlist._id === curTrack.id);
            if (item) {
                let playedTime = moment().format('MM/DD/YYYY HH:mm:ss');
                let tmp = {
                    hId: Date.now(),
                    id: item.playlist._id,
                    url: item.playlist.data.url,
                    title: item.playlist.data.title,
                    artist: item.users[0].data.full_name,
                    description: item.playlist.data.description,
                    artwork: item.playlist.data.picture,
                    duration: timeToSeconds(item.playlist.data.duration_string),
                    position: position,
                    format: 'MP4',
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

    const playFromStart = () => {
        if (network.isConnected) {
            playRemoteFiles();
        } else {
            playLocalFiles();
        }
    };

    function playLocalFiles() {
        let localList = playlistData.formattedList.filter(o => !o.url.includes('http'));
        if (localList.length === 0) {
            Alert.alert('There is no downloaded files!');
            return false;
        }
        setTracks([...localList]);
        setIsPlaying(true);
    }

    function playRemoteFiles() {
        console.log('remote videos ==> ', playlistData.formattedList);
        setTracks([...playlistData.formattedList]);
        setIsPlaying(true);
    }

    // console.log('videoTracks ===> ', videoTracks, videos, videoTracks[currentVideoId]?.url, currentVideoId)

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const skipToNext = () => {
        const len = videoTracks.length;
        setVideo((currentVideoId + 1) % len);
    };

    const skipToPrevious = () => {
        const len = videoTracks.length;
        setVideo((currentVideoId - 1) % len);
    };

    const onDismiss = async () => {
        let curTrack = videoTracks[currentVideoId];
        if (props.dialogState.mode !== 'DOWNLOADED') {
            await saveHistory(position);
            let startInfo = {
                ...curTrack,
                position,
                video_album_id: props.dialogState.album_id,
            };
            dispatch(Actions.setStartSongAction({...startInfo}));
        }
        props.setDialogState(2);
    };

    const cancelAction = () => {
        setVisibleDlg(false);
        playFromStart();
    };

    const okAction = () => {
        setVisibleDlg(false);
        playFromStart();
        let startId = props.dialogState.start.id;
        let startPosition = props.dialogState.start.position;
        let videoId = 0;
        videoTracks.map((item, i) => {
            if (item.id === startId) {
                videoId = i;
            }
        });
        setVideo(videoId);
        setStartPos(startPosition);
    };

    const onLoadStart = (data) => {
        // console.log('onLoadStart');
        setVideoLoading(true);
    };

    const onReadyForDisplay = (data) => {
        // console.log('onReadyForDisplay');
        setVideoLoading(false);
    };

    const onLoadVideo = (e) => {
        // console.log('onLoadVideo');
        setDuration(e.duration);
        videoPlayer.current.seek(startPos);
        setStartPos(0);
        // setVideoLoading(false);
        setIsPlaying(true);
        setPlayerState(PLAYER_STATES.PLAYING);
    };

    const onEndVideo = (e) => {
        const len = videoTracks.length;
        setVideo((currentVideoId + 1) % len);
        // console.log('on end video ===> ', (currentVideoId + 1) % len)
        setPlayerState(PLAYER_STATES.ENDED);
        setIsPlaying(true);
        videoPlayer.current.seek(0);
    };

    const onBuffer = () => {
        console.log('buffering');
        // setVideoLoading(true);
    };

    const videoError = () => {

    };

    const onPaused = (e) => {
        setPlayerState(PLAYER_STATES.PAUSED);
    };

    const onProgress = (e) => {
        setProgress(e.currentTime);
    };

    const onFullScreen = () => {
        // Orientation.lockToLandscape();
        setStartPos(position);
        setFullScreen(true);
    };

    const onExitFull = () => {
        // Orientation.lockToPortrait();
        setStartPos(position);
        setFullScreen(false);
    };

    const {width, height} = Dimensions.get('window');

    // console.log(width, height)

    return (
        <View style={isFullscreen ? styles.fullScreen : styles.normalScreen}>
            <ScrollView
                // showsVerticalScrollIndicator={false}
                // showsHorizontalScrollIndicator={false}
            >
                {
                    !isFullscreen && <View style={styles.fTitleContainer}>
                        {videoTracks.length > 0 && <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 35,
                            width: '100%',
                        }}>
                            <Text style={styles.fTitle}>{videoTracks[currentVideoId].title || 'No Selected'}</Text>
                        </View>}
                        <Icon
                            name='times'
                            type='font-awesome'
                            color='#aaa'
                            size={24}
                            raised={true}
                            containerStyle={{position: 'absolute', right: 5}}
                            onPress={onDismiss}
                        />
                    </View>
                }

                <View style={isFullscreen ? styles.fullScreen : styles.videoContainer}>
                    {videoTracks.length === 0 ?
                        <LoadingImage/>
                        :
                        <>
                            <Video
                                // source={{uri: videos[currentVideoId]}}   // Can be a URL or a local file.
                                source={{uri: videoTracks[currentVideoId]?.url}}   // Can be a URL or a local file.
                                ref={videoPlayer}
                                onBuffer={onBuffer}                // Callback when remote video is buffering
                                onError={videoError}               // Callback when video cannot be loaded
                                // style={styles.backgroundVideo}
                                playInBackground={true}
                                resizeMode={'contain'}
                                // resizeMode={isFullscreen ? 'contain' : 'cover'}
                                // controls={isFullscreen}
                                controls={false}
                                fullscreenAutorotate={true}
                                // poster={'https://assets.tcog.hk/0njz6jybdt.png'}
                                poster={videoTracks[currentVideoId].artwork}
                                posterResizeMode={'cover'}
                                selectedTextTrack={{
                                    type: 'title',
                                    value: 'English Subtitles',
                                }}
                                trackId={123}
                                paused={!isPlaying}
                                onLoadStart={onLoadStart}
                                onLoad={onLoadVideo}
                                onReadyForDisplay={onReadyForDisplay}
                                onPaused={onPaused}
                                onEnd={onEndVideo}
                                onProgress={onProgress}
                                repeat={true}
                                // fullscreen={true}
                                style={isFullscreen ? {
                                    width: isVideoLoading ? 0 : width,
                                    height: height,
                                    backgroundColor: '#000',
                                } : styles.backgroundVideo}
                            />
                            {isFullscreen && isVideoLoading && <View style={{
                                position: 'absolute',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                                height: '100%',
                                width: '100%',
                                backgroundColor: '#000',
                            }}>
                                <ActivityIndicator size="large" color="#fff"/>
                            </View>}

                            {isFullscreen ?
                                <Icon
                                    name='fullscreen-exit'
                                    type='material'
                                    size={36}
                                    color='#888'
                                    containerStyle={{position: 'absolute', right: 15, top: 15}}
                                    onPress={onExitFull}
                                />
                                :
                                <Icon
                                    name='fullscreen'
                                    type='material'
                                    size={36}
                                    color='#888'
                                    containerStyle={{position: 'absolute', right: 15, top: 15}}
                                    onPress={onFullScreen}
                                />}
                        </>
                    }
                </View>

                {
                    !isFullscreen && <>
                        <View style={styles.fDescContainer}>
                            {
                                videoTracks.length > 0 &&
                                <View>
                                    <Text numberOfLines={readmore ? null : 2} ellipsizeMode={readmore ? null : 'tail'}>
                                        {videoTracks[currentVideoId].description || ''}
                                    </Text>
                                    <TouchableOpacity onPress={() => setReadmore(!readmore)}>
                                        <Text
                                            style={{color: globalStyle?.primary_color_2}}>{readmore ? 'Less ...' : 'Read more ...'}</Text>
                                    </TouchableOpacity>
                                </View>
                                /*<Text
                                    lineBreakMode={'tail'}
                                    numberOfLines={4}
                                >
                                    {videoTracks[currentVideoId].description || ''}
                                </Text>*/
                            }
                        </View>

                        <ProgressBar position={position} duration={duration} videoPlayer={videoPlayer}/>

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
                                name={
                                    isPlaying ? 'pause-circle' : 'play-circle'
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
                    </>
                }
            </ScrollView>

            <Portal>
                <Dialog visible={visibleDlg} onDismiss={cancelAction}>
                    <Dialog.Title>Confirm</Dialog.Title>
                    <Dialog.Content>
                        <View style={styles.dialogInfo}>
                            <Image
                                // source={{uri: 'https://assets.tcog.hk/0njz6jybdt.png'}}
                                source={{uri: props.dialogState.start.artwork}}
                                style={styles.dImage}
                            />
                            <View style={{paddingHorizontal: 10}}>
                                {
                                    props.dialogState.start.title !== undefined &&
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                                        {props.dialogState.start.title.length < 30 ?
                                            props.dialogState.start.title
                                            : `${props.dialogState.start.title.substring(0, 30)}...`}
                                    </Text>
                                }
                                <Text style={{fontSize: 14}}>{props.dialogState.start.artist}</Text>
                                <Text style={{fontSize: 12, color: globalStyle?.gray_tone_1}}>
                                    {secondsToTime(props.dialogState.start.position) + ' / ' + secondsToTime(props.dialogState.start.duration)}
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
            // width: '100%',
            // height: '100%',
        },
        normalScreen: {
            backgroundColor: '#fff',
            width: '100%',
            height: '100%',
            padding: 10,
        },
        fTitleContainer: {
            flexDirection: 'row',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            // justifyContent: 'space-between',
        },
        fTitle: {
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
        },
        videoContainer: {
            alignItems: 'center',
            paddingTop: 20,
            height: 320,
        },
        backgroundVideo: {
            position: 'absolute',
            top: 10,
            left: 0,
            bottom: 10,
            right: 0,
            backgroundColor: '#000',
        },
        fImage: {
            width: 360,
            height: 300,
        },
        fDescContainer: {
            height: 80,
            justifyContent: 'center',
        },
        fControllerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
        },

        miniContent: {
            width: '50%',
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
    });
};

const mapStateToProps = state => ({
    dialogState: state.dialogState,
    userData: state.userData,
    playlistData: state.playlistData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setDialogState: setDialogStateAction,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VideoDialog);
