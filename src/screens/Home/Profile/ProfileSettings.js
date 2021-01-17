import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Alert, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {Avatar, Button, Icon, ListItem, Input, Image} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {AuthContext} from '../../../../App';
import Toast from 'react-native-simple-toast';
import * as Actions from '../../../redux/actions';
import {updateProfileService} from '../../../services/profile';
// import {globalStyle} from '../../../assets/style';
import {useAppSettingsState} from '../../../context/AppSettingsContext';
import jwtDecode from 'jwt-decode';
import { normalizeKey } from '../../../services/common';

function ProfileSettings({navigation}) {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';
    const style = useStyles(config.style);
    const globalStyle = {...config.style};

    let dispatch = useDispatch();
    let profileData = useSelector((rootReducer) => rootReducer.profileData);
    let userData = useSelector((rootReducer) => rootReducer.userData);

    const {signOut} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [customClaims, setCustomClaims] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(profileData.data);
        setCustomClaims(profileData.data?.custom_claims || []);
    }, []);

    const updateProfile = () => {
        setLoading(true);
        let id_token = userData.id_token;
        let {user_id} = auth_strategy ? {} : (jwtDecode(id_token));

        let data = {
            user_id,
            ...formData,
        };
        updateProfileService(data)
            .then((res) => {
                dispatch(Actions.setProfileAction(formData));
                setLoading(false);
                Toast.showWithGravity('Your profile has been updated successfully!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            })
            .catch(err => {
                setLoading(false);
                Toast.showWithGravity('Updating your profile failed!', Toast.LONG, Toast.BOTTOM, [
                    'RCTModalHostViewController',
                ]);
            });
    };

    const handleInputValue = (value, label) => {
        setFormData({
            ...formData,
            [label]: value,
        });
    };

    return (
        <ScrollView style={style.container}>
            <View style={style.inputContainer}>
                {
                    customClaims.map((item, index) => (
                        <Input
                            key={index}
                            label={normalizeKey(item.label) || ''}
                            placeholder={normalizeKey(item.label) || ''}
                            // leftIcon={{type: 'font-awesome', name: 'building'}}
                            leftIcon={() => <Image source={{uri: item.icon}} style={{width: 30, height: 30}}/>}
                            value={formData[item.label] || ''}
                            onChangeText={(v) => handleInputValue(v, item.label)}
                        />
                    ))
                }
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
                    buttonStyle={{backgroundColor: globalStyle.primary_color_2}}
                    onPress={updateProfile}
                    loading={loading}
                />
            </View>
        </ScrollView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            height: '100%',
            // alignItems: 'center',
            paddingTop: 20,
            backgroundColor: 'white',
        },
        textStyle: {
            color: 'green',
            fontSize: 16,
        },
        inputContainer: {
            width: '100%',
            padding: 10,
            alignItems: 'center',
        },
    });
};

export default ProfileSettings;
