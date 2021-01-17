import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Linking,
    Platform, Dimensions, SafeAreaView,
} from 'react-native';
import {Avatar, Button, Icon, Accessory, ListItem, Card, Image} from 'react-native-elements';
import jwtDecode from 'jwt-decode';
import Toast from 'react-native-simple-toast';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../../../redux/actions';
import {createShortCode, normalizeKey, uriToBlob} from '../../../services/common';
import noAvatar from '../../../assets/images/no_avatar.png';
import loadingAvatar from '../../../assets/images/LoadingAvatar.gif';
import {getProfileService, getUserProfile, updateAvatar, uploadAvatar} from '../../../services/profile';
import LoadingProfile from './components/LoadingProfile';
import {useAppSettingsState} from '../../../context/AppSettingsContext';
import WebView from 'react-native-webview';
import {TabView, SceneMap} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import LoadingSpinner from '../../../components/LoadingSpinner';
import MainContainer from '../../../components/Layout/MainContainer';

const ProfileScreen = (props) => {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';
    const style = useStyles(config.style);
    const globalStyle = {...config.style};

    let dispath = useDispatch();
    let profileData = useSelector((rootReducer) => rootReducer.profileData);
    let userData = useSelector((rootReducer) => rootReducer.userData);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [avatarImage, setAvatar] = useState(null);
    const [profile, setProfile] = useState(null);
    const [user_id, setUserID] = useState(null);
    const [loading, setLoading] = useState(false);

    // const [currentTab, setCurrentTab] = useState(0);
    const [tabState, setTabState] = useState({
        index: 0,
        routes: [
            {key: 'custom_claims', title: 'Profile', url: ''},
            // {key: 'second', title: 'Second'},
        ],
    });

    const ref = useRef(null);

    useEffect(() => {
        ref.current = true;
        return () => {
            ref.current = null;
        };
    });

    useEffect(() => {
        if (ref.current) {
            setLoading(true);
            let id_token = userData.id_token;
            let {first_name, last_name, email, user_id} =  auth_strategy ? {} : (jwtDecode(id_token));
            setName(first_name + ' ' + last_name);
            setEmail(email);
            getProfileService(user_id).then(res => {
                console.log('user profile ==> ', res);
                if (res.data?.picture !== undefined) {
                    setAvatar(res.data.picture);
                }
                setLoading(false);
                let profi = res.data;
                let tmpRoutes = [];
                profi.tabs.map((tab, index) => {
                    tmpRoutes.push({
                        key: tab.label,
                        title: tab.label,
                        url: tab.url,
                        icon: tab.icon,
                    });
                });
                if (tabState.routes.length === 1) {
                    setTabState({
                        ...tabState,
                        routes: [
                            ...tabState.routes,
                            ...tmpRoutes,
                        ],
                    });
                }
                dispath(Actions.setProfileAction(res.data));
                // setProfile(res.data.data);
                setUserID(res.data._id);
            }).catch(err => {
                setLoading(false);
            });
        }

    }, []);

    useEffect(() => {
        setProfile(profileData.data);
        // setProfile(profileData);
    }, [profileData]);

    /*const onUpdateAvatar = () => {
        const options = {
            title: 'Select Avatar',
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                // path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response);
                // uri: "content://com.google.android.apps.photos.contentprovider/-1/1/content%3A%2F%2Fmedia%2Fexternal%2Fimages%2Fmedia%2F27/ORIGINAL/NONE/908535589"
                // path: "/storage/emulated/0/DCIM/Camera/IMG_20201005_201549.jpg"

                let uri = response.uri;
                // let uri = 'data:' + response.type + ';base64,' + response.data;
                setLoading(true);
                uriToBlob(uri).then(blob => {
                    let type = response.type;
                    let fileExtension = response.fileName.split('.').reverse()[0];
                    let fileId = createShortCode();
                    let filenameRandom = fileId + '.' + fileExtension;
                    let data = {
                        'Bucket': 'assets.tcog.hk',
                        'Expires': 86400,
                        'Key': filenameRandom,
                        'ContentType': type,
                        'ACL': 'public-read',
                    };
                    uploadAvatar(data, blob, response).then(res => {
                        setLoading(false);
                        console.log('avatar ===> ', res);
                        setAvatar(res);
                        updateAvatar(res, user_id).then(res => {
                            Toast.showWithGravity('Image have been uploaded successfully!', Toast.LONG, Toast.BOTTOM, [
                                'RCTModalHostViewController',
                            ]);
                        }).catch(err => {
                            Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                                'RCTModalHostViewController',
                            ]);
                        });
                    }).catch(err => {
                        setLoading(false);
                        Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                            'RCTModalHostViewController',
                        ]);
                    });
                }).catch(err => {
                    console.log('err==> ', err);
                    setLoading(false);
                    Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                });
            }
        });
    };*/


    const onUpdateAvatar = () => {

        ImagePicker.openPicker({
            width: 300,
            height: 400,
            includeBase64: true,
            cropping: true,
        }).then(response => {
            console.log(response);

            // let uri = response.sourceURL.replace('file://', '');
            let uri_ios = `data:${response.mime};base64,${response.data}`;
            // let uri_android = response.path.replace("file://", "");
            let uri_android = response.path;
            let uri = Platform.OS === 'android' ? uri_android : uri_ios;

            setLoading(true);
            uriToBlob(uri).then(blob => {
                // let fileExtension = response.filename.split('.').reverse()[0];
                let fileExtension = response.mime.split('/').reverse()[0];
                let fileId = createShortCode();
                let filenameRandom = fileId + '.' + fileExtension;
                let data = {
                    'Bucket': 'assets.tcog.hk',
                    'Expires': 86400,
                    'Key': filenameRandom,
                    // 'ContentType': Platform.OS === 'android' ? response.type : response.mime,
                    'ContentType': response.mime,
                    'ACL': 'public-read',
                };
                uploadAvatar(data, blob, response).then(res => {
                    setLoading(false);
                    console.log('avatar ===> ', res);
                    setAvatar(res);
                    updateAvatar(res, user_id).then(res => {
                        Toast.showWithGravity('Image have been uploaded successfully!', Toast.LONG, Toast.BOTTOM, [
                            'RCTModalHostViewController',
                        ]);
                    }).catch(err => {
                        Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                            'RCTModalHostViewController',
                        ]);
                    });
                }).catch(err => {
                    setLoading(false);
                    Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                });
            }).catch(err => {
                console.log('err==> ', err);
                setLoading(false);
                Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            });
        });

    };


    const onSettings = () => {
        props.navigation.navigate('Settings');
    };

    const _handleIndexChange = index => setTabState({...tabState, index});

    const _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View style={style.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    /*const color = Animated.color(
                        Animated.round(
                            Animated.interpolate(props.position, {
                                inputRange,
                                outputRange: inputRange.map(inputIndex =>
                                    inputIndex === i ? 255 : 0
                                ),
                            })
                        ),
                        0,
                        0
                    );*/

                    const color = tabState.index === i ? globalStyle.primary_color_2 : globalStyle.gray_tone_3;

                    return (
                        <TouchableOpacity
                            key={i}
                            activeOpacity={0.8}
                            style={[
                                Platform.OS === 'android' ? style.tab : style.tabIOS,
                                tabState.index === i && style.activeTabContainer
                            ]}
                            onPress={() => setTabState({...tabState, index: i})}>
                            {/*<Animated.Text style={{color}}>{route.title}</Animated.Text>*/}
                            <Text style={{color}}>{route.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    /*const _renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });*/
    const MyWebView = ({url}) => (
        <WebView
            source={{uri: url}}
            renderLoading={() => <LoadingSpinner/>}
            startInLoadingState={true}
        />
    );

    const CustomClaims = ({profile}) => {
        return (
            <MainContainer style={{padding: 20}}>
                {
                    profile?.custom_claims?.map((it, index) => (
                        <ListItem key={index} bottomDivider>
                            <Image source={{uri: it.icon}} style={{width: 40, height: 40}}/>
                            <ListItem.Content>
                                <ListItem.Title>{normalizeKey(it.label)}</ListItem.Title>
                                <ListItem.Subtitle>{profile[it.label]}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    ))
                }
            </MainContainer>
        );
    };

    const _renderScene = ({route, jumpTo}) => {
        for (let r of tabState.routes) {
            if (route.key === 'custom_claims') {
                return <CustomClaims profile={profile || {}}/>;
            } else if (route.key === r.key) {
                return <MyWebView key={route.key} url={r.url}/>;
            }
        }
    };

    const LazyPlaceholder = ({route}) => (
        <View style={style.scene}>
            <Text>Loading {route.title}…</Text>
        </View>
    );

    const _renderLazyPlaceholder = ({route}) => <LazyPlaceholder route={route}/>;

    if (!profile) {
        return (
            <LoadingProfile/>
        );
    }

    return (
        <SafeAreaView style={style.container}>
            <Icon
                name={'settings'}
                color={globalStyle?.gray_tone_2}
                containerStyle={style.settingsStyle}
                onPress={onSettings}
            />
            <View style={style.topContainer}>
                <TouchableOpacity onPress={onUpdateAvatar}>
                    <Avatar
                        rounded
                        size={100}
                        title={'Avatar'}
                        source={loading ? loadingAvatar : avatarImage ? {uri: avatarImage} : noAvatar}
                        imageProps={{resizeMode: 'cover'}}
                        PlaceholderContent={<ActivityIndicator/>}
                    ><Accessory size={20} style={{backgroundColor: globalStyle?.secondary_color_2}}/></Avatar>
                </TouchableOpacity>
                <Text style={{
                    marginTop: 10,
                    // marginBottom: 10,
                    fontSize: 22,
                    fontWeight: 'bold',
                }}>{profile.full_name}</Text>
                <ListItem.Subtitle>{profile.email}</ListItem.Subtitle>
                {/*<Text style={{
                    // marginBottom: 10,
                    fontSize: 18,
                    fontWeight: '500',
                }}>{profile.position}</Text>*/}
            </View>
            <View
                style={{
                    borderRadius: 10,
                    backgroundImage: 'linear-gradient(0, #fff, #f00)',
                    height: Dimensions.get('screen').height - 180,
                    // height: 400,
                }}
            >
                <TabView
                    lazy
                    navigationState={tabState}
                    renderScene={_renderScene}
                    renderTabBar={_renderTabBar}
                    onIndexChange={_handleIndexChange}
                    renderLazyPlaceholder={_renderLazyPlaceholder}
                    initialLayout={{width: Dimensions.get('window').width}}
                />

                {/*<View style={style.padding}>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={[style.tab, currentTab === 0 && style.activeTabContainer]}
                                      onPress={() => setCurrentTab(0)}>
                        <Text style={[style.tabTitle, currentTab === 0 && style.activeTabTitle]}>Custom Claims</Text>
                    </TouchableOpacity>
                    {
                        profile.tabs?.map((tab, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.8}
                                style={[style.tab, currentTab === index + 1 && style.activeTabContainer]}
                                onPress={() => setCurrentTab(index + 1)}
                            >
                                <Text style={[style.tabTitle, currentTab === index + 1 && style.activeTabTitle]}>
                                    {tab?.label}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <View style={{
                    height: Dimensions.get('screen').height / 2,
                    width: Dimensions.get('screen').width,
                    backgroundColor: 'red',
                }}>
                    <View style={{width: '100%'}}>
                    <TabView
                        // layoutWidth={Dimensions.get("window").width}
                        // style={{ width: Dimensions.get("window").width}}
                        selectedTabIndex={currentTab}
                    >
                        <Tab key={0} style={style.tabContent}>
                            <View style={style.tabContent}>
                                <Text style={style.paragraph}>This is tab 1</Text>
                                <WebView source={{uri: 'https://google.com'}}/>
                            </View>
                        </Tab>

                        <Tab lazy>
                            <View style={style.tabContent}>
                                <WebView source={{uri: 'https://google.com'}}/>
                            </View>
                        </Tab>
                        <Tab lazy>
                            <View style={style.tabContent}>
                                <WebView source={{uri: 'https://google.com'}}/>
                            </View>
                        </Tab>
                    </TabView>
                </View>*/}

                {/*<ListItem bottomDivider>
                    <Icon name={'person'} />
                    <ListItem.Content>
                        <ListItem.Title>Name</ListItem.Title>
                        <ListItem.Subtitle>{profile.full_name}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'mail'} />
                    <ListItem.Content>
                        <ListItem.Title>Email</ListItem.Title>
                        <ListItem.Subtitle>{profile.email}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'building'} type={'font-awesome'} />
                    <ListItem.Content>
                        <ListItem.Title>Office</ListItem.Title>
                        <ListItem.Subtitle>{profile.office}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'info-circle'} type={'font-awesome'} />
                    <ListItem.Content>
                        <ListItem.Title>About Me</ListItem.Title>
                        <ListItem.Subtitle>{profile.description || ''}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'id-card'} type={'font-awesome'} />
                    <ListItem.Content>
                        <ListItem.Title>Profile</ListItem.Title>
                        {profile.profile !== undefined && profile.profile !== '' &&
                            <TouchableOpacity onPress={() => Linking.openURL(profile.profile)}>
                                <ListItem.Subtitle style={style.profileLink}>{profile.profile}</ListItem.Subtitle>
                            </TouchableOpacity>
                        }
                    </ListItem.Content>
                </ListItem>*/}
            </View>
        </SafeAreaView>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
        container: {
            width: '100%',
            height: '100%',
            flex: 1,
            backgroundColor: 'white',
        },
        topContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            height: 180,
        },
        avatarImage: {
            width: 100,
            height: 100,
            borderRadius: 2000,
        },
        settingsStyle: {
            zIndex: 2,
            position: 'absolute',
            top: 20,
            right: 20,
        },
        detailsContainer: {
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 20,
            color: 'red',
        },
        editBtn: {
            color: '#000',
            backgroundColor: 'rgb(101,102,103)',
        },
        buttonContainer: {
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        btnBackground: {
            width: '100%',
            alignItems: 'center',
        },
        profileLink: {
            textDecorationLine: 'underline',
            fontStyle: 'italic',
        },

        padding: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            // paddingTop: 10,
            // backgroundColor: 'red'
        },
        tabIOS: {
            flex: 1,
            height: 45,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopColor: globalStyle.gray_tone_3,
            borderTopWidth: 0.5,

            borderBottomColor: globalStyle.gray_tone_3,
            borderBottomWidth: 1.5,
        },
        tab: {
            flex: 1,
            height: 45,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopColor: globalStyle.gray_tone_3,
            borderTopWidth: 0.5,

            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.4,
            shadowRadius: 3,
            elevation: 5,
        },
        activeTabContainer: {
            // borderBottomColor: globalStyle.secondary_color_1,
            borderBottomColor: globalStyle.primary_color_2,
            borderBottomWidth: 2,
        },
        tabTitle: {
            // color: '#fff',
            color: globalStyle.gray_tone_2,
            fontSize: 18,
        },
        activeTabTitle: {
            fontWeight: 'bold',
            color: globalStyle.primary_color_2,
        },
        tabContent: {
            width: '100%',
            height: '100%',
        },
        paragraph: {
            margin: 24,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
        },

        tabBar: {
            flexDirection: 'row',
            paddingTop: 20,
        },
        tabItem: {
            flex: 1,
            alignItems: 'center',
            padding: 16,
        },
        scene: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
};

export default ProfileScreen;
/*

const mapStateToProps = state => ({
    // feedData: state.feedData,
    profileData: state.profileData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getFeed: getFeedAction,
    setFeed: setFeedAction,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfileScreen);
*/
