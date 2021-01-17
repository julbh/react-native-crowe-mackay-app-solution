import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    SafeAreaView, FlatList,
} from 'react-native';
import {Avatar, Button, Icon, Accessory, ListItem, Card, SearchBar} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import noAvatar from '../../../../assets/images/no_avatar.png';
import {DATA} from '../../../../services/common';
import LoadingScreen from './../components/LoadingScreen';
import {getAllUsersService} from '../../../../services/microApps';
import {imageSize} from '../../../../config';
import jwtDecode from 'jwt-decode';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";


const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

const ContactList = (props) => {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    let dispath = useDispatch();
    let userData = useSelector((rootReducer) => rootReducer.userData);
    let inboxData = useSelector((rootReducer) => rootReducer.inboxData);

    const [allUsers, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);

    const [currentUser, setUser] = useState({});

    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAllUsersService(currentUser.user_id).then((users) => {
            setLoading(false);
            let sortedUsers = _.sortBy(users, o => o.data.full_name);
            setUsers(sortedUsers);
            setRefreshing(false)
        }).catch(err => {
            setLoading(false);
            setRefreshing(false)
        })
        // wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        let curUser = auth_strategy ? {} : (jwtDecode(userData.id_token));
        setUser(curUser);
        setLoading(true);
        getAllUsersService(curUser.user_id).then((users) => {
            setLoading(false);
            let sortedUsers = _.sortBy(users, o => o.data.full_name);
            setUsers(sortedUsers);
        }).catch(err => {
            setLoading(false);
        })
    }, []);

    const renderLoading = () => <LoadingScreen rounded={true}/>;

    if (loading || refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={(text) => setSearchText(text)}
                    value={searchText}
                    round={true}
                    inputContainerStyle={{backgroundColor: 'white'}}
                />
                <FlatList
                    data={DATA}
                    renderItem={renderLoading}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            </SafeAreaView>

        );
    }

    function renderItem({item}) {
        return (
            <TouchableOpacity onPress={() =>
                props.navigation.navigate({name: 'UserProfile', params: item.data})
            }>
                <ListItem
                    bottomDivider
                    containerStyle={item.data.status === 'READ' ? styles.expiredCardContainer : null}
                >
                    <Avatar
                        rounded
                        source={item.data.picture !== undefined && item.data.picture !== '' ?
                            {uri: item.data.picture} : noAvatar}
                        size={imageSize.normal}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{item.data.full_name}</ListItem.Title>
                        <ListItem.Subtitle style={{color: globalStyle?.gray_tone_2}}>{item.data.position}</ListItem.Subtitle>
                        {/* <ListItem.Subtitle style={styles.emailStyle}>{item.data.email}</ListItem.Subtitle> */}
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                round={true}
                inputContainerStyle={{backgroundColor: 'white'}}
            />
            <FlatList
                removeClippedSubviews={true}
                initialNumToRender={5}
                data={allUsers.filter(user => user.data.full_name.toLowerCase().includes(searchText.toLowerCase()))}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                onRefresh={onRefresh}
                refreshing={refreshing}
                contentContainerStyle={{paddingBottom: 20}}
            />
        </SafeAreaView>
    );
};

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            flex: 1,
            backgroundColor: 'white',
        },
        titleStyle: {
            // fontWeight: 'bold',
            fontSize: 13,
        },
        emailStyle: {
            fontWeight: '900',
        }
    })
};

export default ContactList;
