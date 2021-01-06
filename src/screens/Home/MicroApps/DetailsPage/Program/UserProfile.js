import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Linking} from 'react-native';
import {Avatar, Button, Icon, ListItem, Card} from 'react-native-elements';
import noAvatar from '../../../../../assets/images/no_avatar.png';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

const UserProfile = (props) => {

    const [avatarImage, setAvatar] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        let params = props.route.params;
        setProfile(params);
        setAvatar(params.picture);
    }, []);

    if (!profile) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <ScrollView style={style.container}>
            <View style={style.topContainer}>
                <Avatar
                    rounded
                    size={100}
                    title={'Avatar'}
                    source={avatarImage ? {uri: avatarImage} : noAvatar}
                    imageProps={{resizeMode: 'cover'}}
                    PlaceholderContent={<ActivityIndicator/>}
                />
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
            <View style={{
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
                        <ListItem.Subtitle numberOfLines={100}>{profile.description}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name={'id-card'} type={'font-awesome'}/>
                    <ListItem.Content>
                        <ListItem.Title>Profile</ListItem.Title>
                        {profile.profile !== undefined && profile.profile !== '' &&
                        <TouchableOpacity onPress={() => Linking.openURL(profile.profile)}>
                            <ListItem.Subtitle>{profile.profile}</ListItem.Subtitle>
                        </TouchableOpacity>
                        }
                    </ListItem.Content>
                </ListItem>
            </View>
        </ScrollView>
    );
};

let style = StyleSheet.create({
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
});
export default UserProfile;
