import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Alert, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {Avatar, Button, Icon, ListItem, Input} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {AuthContext} from '../../../../App';
import Toast from 'react-native-simple-toast';
import * as Actions from '../../../redux/actions';
import {updateProfileService} from '../../../services/profile';
// import {globalStyle} from '../../../assets/style';
import {useAppSettingsState} from "../../../context/AppSettingsContext";

const ProfileSettings = ({navigation}) => {
    const {config} = useAppSettingsState();
    const style = useStyles(config.style);
    const globalStyle = {...config.style};

    let dispath = useDispatch();
    let profileData = useSelector((rootReducer) => rootReducer.profileData);

    const {signOut} = useContext(AuthContext);
    const [office, setOffice] = useState('');
    const [description, setDescription] = useState('');
    const [profile, setProfile] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOffice(profileData.data.office);
        setDescription(profileData.data.description);
        setProfile(profileData.data.profile);
    }, []);

    const updateProfile = () => {
        setLoading(true);
        let data = {
            user_id: profileData._id,
            // user_id: profileData.data.user_id,
            office, description, profile,
        };
        updateProfileService(data)
            .then((res) => {
                let tmp = {...profileData};
                tmp.data.office = office;
                tmp.data.description = description;
                tmp.data.profile = profile;
                dispath(Actions.setProfileAction(tmp));
                setLoading(false);
                Toast.showWithGravity('Your profile has been updated successfully!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            })
            .catch(err => {
                // console.log('err ===', err)
                setLoading(false);
                Toast.showWithGravity('Updating your profile failed!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            })
    };

    return (
        <ScrollView style={style.container}>
            <View style={style.inputContainer}>
                <Input
                    label="Office"
                    placeholder="Office Name"
                    leftIcon={{type: 'font-awesome', name: 'building'}}
                    value={office}
                    onChangeText={value => setOffice(value)}
                />
                <Input
                    label="About Me"
                    placeholder="About Me"
                    leftIcon={{type: 'font-awesome', name: 'info-circle'}}
                    value={description}
                    onChangeText={value => setDescription(value)}
                />
                <Input
                    label="Profile"
                    placeholder="Profile Link"
                    leftIcon={{type: 'font-awesome', name: 'id-card'}}
                    value={profile}
                    onChangeText={value => setProfile(value)}
                />
                <Button
                    icon={
                        <Icon
                            type={'font-awesome'}
                            name="save"
                            size={16}
                            color="white"
                            containerStyle={{padding: 5}}
                        />
                    }
                    title="Save"
                    containerStyle={{width: '100%'}}
                    buttonStyle={{backgroundColor: globalStyle?.primary_color_2}}
                    onPress={updateProfile}
                    loading={loading}
                />
            </View>
        </ScrollView>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            height: '100%',
            // alignItems: 'center',
            paddingTop: 20,
            backgroundColor: 'white'
        },
        textStyle: {
            color: 'green',
            fontSize: 16,
        },
        inputContainer: {
            width: '100%',
            padding: 10,
            alignItems: 'center',
        }
    })
};

export default ProfileSettings;
