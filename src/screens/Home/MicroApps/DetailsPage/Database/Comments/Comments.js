import React, {useEffect, useRef, useState} from 'react';
import {Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, Icon, ListItem} from 'react-native-elements';
// import {globalStyle} from '../../../../../../assets/style';
import {useDispatch, useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import {getAnythingService, getCommentService, postCommentService} from '../../../../../../services/microApps';
import LoadingSpinner from '../../../../../../components/LoadingSpinner';
import Toast from 'react-native-simple-toast';
import NoData from '../../../../../../components/NoData';
import * as Actions from '../../../../../../redux/actions';
import noAvatar from '../../../../../../assets/images/no_avatar.png';
import Markdown from 'react-native-markdown-renderer';
import human from 'human-time';
import {FAB} from 'react-native-paper';
import {getUserById} from '../../../../../../services/users';
import {useAppSettingsState} from "../../../../../../context/AppSettingsContext";

function Comments({navigation, route}) {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const userData = useSelector((rootReducer) => rootReducer.userData);
    const commentsData = useSelector((rootReducer) => rootReducer.commentsData);
    const [reference_id, setReferenceId] = useState('');
    const [commenter_id, setCommenterId] = useState('');
    const [comment_id, setCommentId] = useState('');
    const [formItem, setFormItem] = useState({});

    const ref = useRef(null);

    useEffect(() => {
        ref.current = true;
        return () => ref.current = false;
    });


    useEffect(() => {
        if (route?.params?.type === 'deeplink') {
            let comment_data = route?.params?.comment;
            setReferenceId(comment_data.reference_id);
            let id_token = userData.id_token;
            let {user_id} = auth_strategy ? {} : (jwtDecode(id_token));
            setCommenterId(user_id);
            getAnythingService(comment_data.reference_id).then(res => {
                console.log('res ==> ', res);
                getUserById(res.data.user_id).then(res => {
                    let tmp = {
                        ...res.data,
                        user: {
                            ...res.data,
                        },
                    };
                    setFormItem(tmp);
                    navigation.navigate('CommentDetails', {
                        details: comment_data.content,
                    });
                }).catch(e => {
                    console.log('form item user err ====> ', e);
                });
            }).catch((e) => {
                console.log('form item  anything err ====> ', e);
            });
            let data = {
                reference_id: comment_data.reference_id,
                commenter_id: user_id,
            };
            dispatch(Actions.getCommentsAction(data));
        } else {
            if (route?.params?.reference_id) {
                setReferenceId(route?.params?.reference_id);
                let id_token = userData.id_token;
                let {user_id} =  auth_strategy ? {} : (jwtDecode(id_token));
                setCommenterId(user_id);
                let data = {
                    reference_id: route?.params?.reference_id,
                    commenter_id: user_id,
                };
                dispatch(Actions.getCommentsAction(data));
            }
            if (route?.params?.item) {
                setFormItem(route?.params?.item);
            }
        }
    }, [route]);

    const onClickItem = (item) => {
        navigation.navigate('CommentDetails', {
            details: item.data.content,
        });
    };

    const onDelete = (item) => {
        Alert.alert(
            'Please confirm!',
            'Are you sure delete this item?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => onOK()},
            ],
            {cancelable: false},
        );

        function onOK() {
            let data = {
                reference_id,
                commenter_id,
            };
            postCommentService(item._id, {}, 'delete').then(res => {
                let newData = [...commentsData.data];
                const prevIndex = commentsData.data.findIndex(it => it._id === item._id);
                newData.splice(prevIndex, 1);
                dispatch(Actions.setCommentsAction(newData));
                Toast.show('You have deleted a comment successfully!', Toast.LONG, Toast.BOTTOM, [
                    'UIAlertController',
                ]);
            }).catch(err => {
                console.log('delete erorr ==> ', err, data, comment_id, item);
                Toast.show('Something went wrong!', Toast.LONG, Toast.BOTTOM, [
                    'UIAlertController',
                ]);
            });
        }
    };

    const onEdit = (item) => {
        navigation.navigate('EditComment', {
            reference_id,
            _id: item._id,
            item,
            formItem,
        });
    };

    const onNew = (item) => {
        navigation.navigate('EditComment', {
            reference_id,
            action: 'new',
            formItem,
        });
    };

    if (commentsData.loading) {
        return <LoadingSpinner/>;
    } else if (commentsData.data?.length === 0) {
        return (
            <>
                <NoData/>
                <FAB
                    style={{...styles.fab, backgroundColor: globalStyle?.primary_color_2}}
                    color={'white'}
                    small={false}
                    animated
                    icon={'plus'}
                    onPress={() => onNew()}
                />
            </>
        );
    }

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => onClickItem(item)}>
                <ListItem
                    bottomDivider
                    // containerStyle={item.data.status === 'READ' ? styles.expiredCardContainer : null}
                >
                    <Avatar rounded
                            source={item.user_data.picture === undefined || '' ? noAvatar : {uri: item.user_data.picture}}
                            size={'medium'}/>
                    <ListItem.Content>
                        {/*<Markdown>{item.data.content}</Markdown>*/}
                        <ListItem.Title
                            numberOfLines={2}
                            ellipsizeMode='tail'
                        >
                            {item.data.content}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.timeStyle}>
                            {human((Date.now() - (new Date(item.createdAt)).getTime()) / 1000)}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <View>
                        <TouchableOpacity style={{padding: 5}} onPress={() => onEdit(item)}>
                            <Icon name="pencil" type="font-awesome" size={18}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 5}} onPress={() => onDelete(item)}>
                            <Icon name="trash-o" type="font-awesome" size={18}/>
                        </TouchableOpacity>
                    </View>
                </ListItem>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View></View>
            <FlatList
                data={commentsData.data}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                // onRefresh={onRefresh}
                // refreshing={refreshing}
                contentContainerStyle={{paddingBottom: 20}}
            />
            <FAB
                style={{...styles.fab, backgroundColor: globalStyle?.primary_color_2}}
                color={'white'}
                small={false}
                animated
                icon={'plus'}
                onPress={() => onNew()}
            />
        </SafeAreaView>
    );
}

export default Comments;

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingVertical: 20,
            paddingHorizontal: 10,
        },
        textInput: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: globalStyle?.gray_tone_3,
            borderRadius: 5,
            paddingHorizontal: 10,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        },
    })
};

