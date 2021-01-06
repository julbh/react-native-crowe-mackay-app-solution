import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView, FlatList,
} from 'react-native';
import {Avatar, Button, Icon, Accessory, ListItem, Card, SearchBar, CheckBox} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {Chip} from 'react-native-paper';
import _ from 'lodash';
import noAvatar from '../../../../assets/images/no_avatar.png';
import * as Actions from '../../../../redux/actions';
import {DATA} from '../../../../services/common';
import {getAllUsersService} from '../../../../services/microApps';
import UserLoading from '../components/UserLoading';
import {imageSize} from '../../../../config';
import jwtDecode from 'jwt-decode';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

const NewChat = (props) => {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    let dispatch = useDispatch();
    let userData = useSelector((rootReducer) => rootReducer.userData);
    let inboxData = useSelector((rootReducer) => rootReducer.inboxData);
    let chatUsersReducer = useSelector((rootReducer) => rootReducer.chatUsersReducer);
    let selectedUsers = useSelector((rootReducer) => rootReducer.selectedUsers);

    const [allUsers, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    // const [selectedUsers, setSelectedUsers] = useState([]);
    const [user, setUser] = useState({});

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAllUsersService(user.user_id).then((users) => {
            setLoading(false);
            let sortedUsers = _.sortBy(users, o => o.data.full_name);
            setUsers(sortedUsers);
            setRefreshing(false);
        }).catch(err => {
            setLoading(false);
            setRefreshing(false);
        });
        // wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        let curUser = (jwtDecode(userData.id_token));
        setUser(curUser);
        setLoading(true);
        getAllUsersService(curUser.user_id).then((users) => {
            setLoading(false);
            let sortedUsers = _.sortBy(users, o => o.data.full_name);
            setUsers(sortedUsers);
        }).catch(err => {
            setLoading(false);
        });
    }, []);

    const renderLoading = () => <UserLoading/>;

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

    const selectUser = (user) => {
        // if (_.find([...chatUsersReducer], o => o._id === user._id) !== undefined) {
        if (_.find([...selectedUsers], o => o._id === user._id) !== undefined) {
            removeUser(user);
            return;
        }
        // dispatch(Actions.setChatUsersAction([...chatUsersReducer, user]));
        dispatch(Actions.setSelectedUsersAction([...selectedUsers, user]));
    };

    const removeUser = (user) => {
        // let tmp = [...chatUsersReducer];
        let tmp = [...selectedUsers];
        let newUsers = tmp.filter(o => o._id !== user._id);
        // dispatch(Actions.setChatUsersAction([...newUsers]));
        dispatch(Actions.setSelectedUsersAction([...newUsers]));
    };

    const renderItem = ({item}) => {
        return (
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
                    <ListItem.Subtitle
                        style={{color: globalStyle?.gray_tone_2}}>{item.data.position}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.CheckBox
                    center
                    iconRight
                    iconType='material-community'
                    checkedIcon='checkbox-marked-circle-outline'
                    uncheckedIcon='checkbox-blank-circle-outline'
                    checkedColor='lightgreen'
                    // checked={_.find([...chatUsersReducer], o => o._id === item._id) !== undefined}
                    checked={_.find([...selectedUsers], o => o._id === item._id) !== undefined}
                    onPress={() => selectUser(item)}
                />
            </ListItem>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                round={true}
                inputContainerStyle={{backgroundColor: 'white'}}
            />
            <View style={styles.chipWraper}>
                {
                    selectedUsers.map((user, index) => (
                    // chatUsersReducer.map((user, index) => (
                        <Chip
                            key={index}
                            avatar={<Avatar
                                rounded
                                source={{uri: user.data.picture}}
                                /*source={{
                                    uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                                }}*/
                            />}
                            children={
                                <View style={styles.chipTextWraper}>
                                    <Text style={styles.chipText}>{user.data.full_name}</Text>
                                    <Icon
                                        name={'close-circle-outline'}
                                        type={'material-community'}
                                        onPress={() => removeUser(user)}
                                    />
                                </View>
                            }
                            style={styles.chipStyle}
                        />
                    ))
                }
            </View>
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
            flex: 1,
            backgroundColor: 'white',
        },
        titleStyle: {
            fontSize: 13,
        },
        emailStyle: {
            fontWeight: '900',
        },
        chipStyle: {
            margin: 5,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            backgroundColor: globalStyle?.secondary_color_1,
        },
        chipWraper: {
            margin: 5,
            flexWrap: 'wrap',
            flexDirection: 'row',
        },
        chipTextWraper: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        chipText: {
            color: 'black',
            paddingHorizontal: 5,
        },
    })
};

export default NewChat;
