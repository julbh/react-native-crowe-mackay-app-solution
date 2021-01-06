import React, {useContext, useEffect, useRef, useState} from 'react';
import {Avatar, Badge, Button, Icon, Text} from 'react-native-elements';
import {ScrollView, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
// import {globalStyle} from '../../../../assets/style';
import BackButton from '../../../../components/BackButton';
import noAvatar from '../../../../assets/images/no_avatar.png';
import {useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

function ChatBoxHeader({title, goBack, chatUsers,}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const userData = useSelector(({userData}) => userData);
    const [curUser, setUser] = useState({});

    useEffect(() => {
        let curUser = (jwtDecode(userData.id_token));
        setUser(curUser);
    }, []);

    const combineNames = (users) => {
        let tmp = [];
        users.filter(o => o._id !== curUser.user_id).map(user => {
            tmp.push(user.full_name);
        });
        return tmp.join(', ');
    };

    let users = chatUsers.filter(o => o._id !== curUser.user_id);

    return (
        <>
            <View style={styles.container}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        left: 0,
                    }}
                >
                    <BackButton goBack={goBack}/>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 3}}>
                    <View style={{flexDirection: 'row', paddingVertical: 3}}>
                        <Avatar
                            rounded={true}
                            source={users[0].picture !== undefined && users[0].picture !== '' ?
                                {uri: users[0].picture} : noAvatar}
                            size={30}
                        />
                        <React.Fragment>
                            {
                                users.map((u, index) => {
                                    if (index > 0 && index < 5) {
                                        return (
                                            <Avatar
                                                key={index}
                                                rounded={true}
                                                source={u.picture !== undefined && u.picture !== '' ?
                                                    {uri: u.picture} : noAvatar}
                                                size={30}
                                                containerStyle={{marginLeft: -10}}
                                            />
                                        );
                                    }
                                })
                            }
                        </React.Fragment>
                        {
                            users.length < 2 ?
                                <View style={{paddingHorizontal: 5, justifyContent: 'center'}}>
                                    <Text style={styles.text}>{combineNames(chatUsers)}</Text>
                                </View>
                                :
                                users.length > 5 ? <Avatar
                                        rounded={true}
                                        title={`+${users.length - 5}`}
                                        size={30}
                                        containerStyle={{marginLeft: -10, backgroundColor: 'white'}}
                                        titleStyle={{color: globalStyle?.primary_color_2}}
                                    />
                                    :
                                    null
                        }
                    </View>
                </View>
            </View>
        </>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 2,
            backgroundColor: globalStyle?.common_header_color,
            borderBottomColor: globalStyle?.gray_tone_3,
        },
        text: {
            fontSize: 20,
            fontWeight: 'bold',
            color: globalStyle?.primary_color_2,
        },
    })
};

export default ChatBoxHeader;
