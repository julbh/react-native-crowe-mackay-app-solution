import React, {useContext, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView, Linking} from 'react-native';
import {Avatar, Button, Icon, Accessory, ListItem, Card} from 'react-native-elements';
import jwtDecode from 'jwt-decode';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../../../redux/actions';
import {createShortCode, uriToBlob} from '../../../services/common';
import noAvatar from '../../../assets/images/no_avatar.png';
import loadingAvatar from '../../../assets/images/LoadingAvatar.gif';
import {getUserProfile, updateAvatar, uploadAvatar} from '../../../services/profile';
// import {globalStyle} from '../../../assets/style';
import LoadingProfile from './components/LoadingProfile';
import {useAppSettingsState} from "../../../context/AppSettingsContext";

const ProfileScreen = (props) => {
    const {config} = useAppSettingsState();
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

    const ref = useRef(null);

    useEffect(() => {
        ref.current = true;
        return () => {
            ref.current = null;
        };
    });

    useEffect(() => {
        if (ref.current) {
            /*let id_token = userData.id_token;
            // let { first_name, last_name, email, user_id } = (jwtDecode(id_token));
            let user = (jwtDecode(id_token));
            console.log(user);
            setName(user.full_name);
            setEmail(user.email);
            dispath(Actions.setProfileAction({data: user}));*/
            // setProfile(user);

            setLoading(true);
            let id_token = userData.id_token;
            let {first_name, last_name, email, user_id} = (jwtDecode(id_token));
            setName(first_name + ' ' + last_name);
            setEmail(email);
            getUserProfile(user_id).then(res => {
                if (res.data.data.picture !== undefined) {
                    setAvatar(res.data.data.picture);
                }
                setLoading(false);
                dispath(Actions.setProfileAction(res.data));
                // setProfile(res.data.data);
                setUserID(res.data._id);
            }).catch(err => {
                setLoading(false);
            });

            /*AsyncStorage.getItem('id_token')
                .then((response) => {
                    let { first_name, last_name, email, user_id } = (jwtDecode(response));
                    console.log(user_id);
                    setName(first_name + ' ' + last_name);
                    setEmail(email);
                    getUserProfile(user_id).then(res => {
                        if (res.data.data.picture !== undefined) {
                            setAvatar(res.data.data.picture);
                        }
                        console.log('prfoile data', res.data);
                        setLoading(false);
                        dispath(Actions.setProfileAction(res.data));
                        // setProfile(res.data.data);
                        setUserID(res.data._id);
                    }).catch(err => {
                        setLoading(false);
                        // console.log('get image failed ==> ', err);
                    });
                })
                .catch(err => {
                    console.log(err);
                });*/
        }

    }, []);

    useEffect(() => {
        setProfile(profileData.data);
        // setProfile(profileData);
    }, [profileData]);

    const onUpdateAvatar = () => {
        const options = {
            title: 'Select Avatar',
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                // path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
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
                uriToBlob(uri).then(res => {
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
                    uploadAvatar(data, res, response).then(res => {
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
                    console.log('err==> ', err)
                    setLoading(false);
                    Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                });
            }
        });
    };

    /*

        const onUpdateAvatar = () => {

            ImagePicker.openPicker({
                width: 300,
                height: 400,
                includeBase64: true,
                cropping: true,
            }).then(response => {

                //path: "file:///storage/emulated/0/Android/data/com.croweconference/files/Pictures/89315219-4d0d-4e31-8e6d-8366f699e8a5.jpg"

                console.log(response);
                // let uri = response.path;
                let uri = response.path.replace('file://', '');
                // let uri = response.sourceURL;
                let mime = response.mime;

                setLoading(true);
                uriToBlob(uri, mime).then(res => {
                    console.log('**********************', res);
                    let type = response.mime;
                    let fileExtension = response.filename.split('.').reverse()[0];
                    let fileId = createShortCode();
                    let filenameRandom = fileId + '.' + fileExtension;
                    let data = {
                        'Bucket': 'assets.tcog.hk',
                        'Expires': 86400,
                        'Key': filenameRandom,
                        'ContentType': mime,
                        'ACL': 'public-read',
                    };
                    uploadAvatar(data, res, response).then(res => {
                        console.log('upload success!!!!!!!!!', res);
                        setLoading(false);
                        setAvatar(res);
                        updateAvatar(res, user_id).then(res => {
                            Toast.showWithGravity('Image have been uploaded successfully!', Toast.LONG, Toast.BOTTOM, [
                                'RCTModalHostViewController',
                            ]);
                        }).catch(err => {
                            console.log('update error ===> ', err);
                            setLoading(false);
                            Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                                'RCTModalHostViewController',
                            ]);
                        });
                    }).catch(err => {
                        console.log('upload error ===> ', err);
                        setLoading(false);
                        Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                            'RCTModalHostViewController',
                        ]);
                    });
                }).catch(err => {
                    console.log('uri to blob error ===> ', err);
                    setLoading(false);
                    Toast.showWithGravity('Uploading image failed!', Toast.LONG, Toast.BOTTOM, [
                        'RCTModalHostViewController',
                    ]);
                });
            });

        };
    */

    const onSettings = () => {
        props.navigation.navigate({name: 'Settings'});
    };

    if (!profile) {
        return (
            <LoadingProfile/>
        );
    }

    return (
        <ScrollView style={style.container}>
            <Icon
                name={'settings'}
                color={globalStyle?.gray_tone_2}
                containerStyle={style.settingsStyle}
                onPress={onSettings}
            />
            <View style={style.topContainer}>
                {/*<TouchableOpacity onPress={onUpdateAvatar}>*/}
                    <Avatar
                        rounded
                        size={100}
                        title={'Avatar'}
                        source={loading ? loadingAvatar : avatarImage ? {uri: avatarImage} : noAvatar}
                        imageProps={{resizeMode: 'cover'}}
                        PlaceholderContent={<ActivityIndicator/>}
                    ><Accessory size={20} style={{backgroundColor: globalStyle?.secondary_color_2}}/></Avatar>
                {/*</TouchableOpacity>*/}
                <Text style={{
                    marginTop: 10,
                    marginBottom: 10,
                    fontSize: 22,
                    fontWeight: 'bold',
                }}>{profile.full_name}</Text>
                <Text style={{
                    marginBottom: 10,
                    fontSize: 18,
                    fontWeight: '500',
                }}>{profile.position}</Text>
            </View>
            <View containerStyle={{
                borderRadius: 10,
                backgroundImage: 'linear-gradient(angle, color-stop1, color-stop2)',
            }}>
                <ListItem bottomDivider>
                    <Icon name={'person'}/>
                    <ListItem.Content>
                        <ListItem.Title>Name</ListItem.Title>
                        <ListItem.Subtitle>{profile.full_name}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'mail'}/>
                    <ListItem.Content>
                        <ListItem.Title>Email</ListItem.Title>
                        <ListItem.Subtitle>{profile.email}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'building'} type={'font-awesome'}/>
                    <ListItem.Content>
                        <ListItem.Title>Office</ListItem.Title>
                        <ListItem.Subtitle>{profile.office}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'info-circle'} type={'font-awesome'}/>
                    <ListItem.Content>
                        <ListItem.Title>About Me</ListItem.Title>
                        <ListItem.Subtitle>{profile.description || ''}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'id-card'} type={'font-awesome'}/>
                    <ListItem.Content>
                        <ListItem.Title>Profile</ListItem.Title>
                        {profile.profile !== undefined && profile.profile !== '' &&
                        <TouchableOpacity onPress={() => Linking.openURL(profile.profile)}>
                            <ListItem.Subtitle style={style.profileLink}>{profile.profile}</ListItem.Subtitle>
                        </TouchableOpacity>
                        }
                    </ListItem.Content>
                </ListItem>
            </View>
        </ScrollView>
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
    })
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
