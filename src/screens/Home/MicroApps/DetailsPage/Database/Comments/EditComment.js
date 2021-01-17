import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import {Button, CheckBox, Icon} from 'react-native-elements';
// import {globalStyle} from '../../../../../../assets/style';
import {useDispatch, useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import {
    postCommentService,
    sendNotificationService,
} from '../../../../../../services/microApps';
import LoadingSpinner from '../../../../../../components/LoadingSpinner';
import Toast from 'react-native-simple-toast';
import * as Actions from '../../../../../../redux/actions';
import {app_prefix, BEAMS_INSTANCE_ID, BEAMS_SECRET_KEY} from '../../../../../../config';
import {useAppSettingsState} from "../../../../../../context/AppSettingsContext";

function EditComment({navigation, route}) {
    const {config} = useAppSettingsState();
    const auth_strategy = config.app_settings?.auth_strategy === 'NONE';
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const dispatch = useDispatch();
    const userData = useSelector((rootReducer) => rootReducer.userData);

    const [reference_id, setReferenceId] = useState('');
    const [commenter_id, setCommenterId] = useState('');
    const [content, setContent] = useState('');
    const [comment_id, setCommentId] = useState('');
    const [actionType, setActionType] = useState('');

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [formItem, setFormItem] = useState({});
    const [commentItem, setCommentItem] = useState({});
    const [current_user, setCurrentUser] = useState({});

    const ref = useRef(null);

    useEffect(() => {
        ref.current = true;
        return () => ref.current = false;
    });

    useEffect(() => {
        setLoading(true);
        let id_token = userData.id_token;
        let user =  auth_strategy ? {} :(jwtDecode(id_token));
        setCurrentUser(user);
        if (route?.params?.action === 'new') {
            setActionType('new');
            setContent('');
            setCommentId('');
            setReferenceId(route?.params?.reference_id);
            // setId('');
            let {user_id} = user;
            setCommenterId(user_id);
        } else if (route?.params?.item) {
            setActionType('');
            let item = route?.params?.item;
            setCommentItem(item);
            setContent(item.data.content);
            setCommentId(item._id);
            setReferenceId(route?.params?.reference_id);
            // setId(item._id);
            setCommenterId(item?.user_data.user_id);
        }
        if (route?.params?.formItem) {
            setFormItem(route.params.formItem);
        }
        setLoading(false);
    }, [route]);

    const onSubmit = () => {
        setSaving(true);
        let method = actionType === 'new' ? 'post' : 'put';
        let commentId = actionType === 'new' ? '' : comment_id;
        console.log('****** formItem ', formItem, commentItem, current_user);
        postCommentService(
            commentId,
            {
                reference_id,
                commenter_id,
                content,
            },
            method,
        ).then(res => {
            setSaving(false);
            if (isChecked && formItem.user?._id !== current_user?.user_id) {
                sendNotification();
            }
            dispatch(Actions.getCommentsAction({reference_id, commenter_id}));
            Toast.show('You have submitted new comment successfully!', Toast.LONG, Toast.BOTTOM, [
                'UIAlertController',
            ]);
        }).catch(err => {
            setSaving(false);
            Toast.show('Something went wrong!', Toast.LONG, Toast.BOTTOM, [
                'UIAlertController',
            ]);
        });
    };

    function sendNotification() {
        let payload = {
            "beam_id": BEAMS_INSTANCE_ID,
            "beam_secret": BEAMS_SECRET_KEY,
            'prefix': app_prefix,
            'title': `New Comment Added`,
            'body': `${current_user.full_name} has commented on your submission.`,
            'scheme': 'tcogcontainer',
            'deeplink': `comment/${commentItem._id}`,
            'receiver_email': formItem.user?.data.email,
            'sender_email': current_user.email,
            'sender_fullname': current_user.full_name,
            'sender_img': current_user.picture,
            'sender_id': current_user.user_id,
        };
        sendNotificationService(payload).then(res => {
        }).catch(err => {
        });
    }

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <TextInput
                    mode={'outlined'}
                    multiline={true}
                    numberOfLines={6}
                    placeholder="Comment here ..."
                    style={{...styles.textInput}}
                    value={content}
                    onChangeText={text => setContent(text)}
                />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <CheckBox
                    // checkedTitle={`Notify ${formItem?.user?.data.full_name} about your comment`}
                    title={`Notify ${formItem?.user?.data.full_name} about your comment`}
                    // title="Don't send notification"
                    checked={isChecked}
                    onPress={() => setIsChecked(!isChecked)}
                    checkedColor={globalStyle?.primary_color_2}
                    containerStyle={{width: '100%'}}
                />
            </View>
            <View>
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
                    title="Submit"
                    containerStyle={{width: '100%', marginTop: 10, marginBottom: 30}}
                    buttonStyle={{backgroundColor: globalStyle?.primary_color_2}}
                    onPress={onSubmit}
                    loading={saving}
                />
            </View>
        </SafeAreaView>
    );
}

export default EditComment;

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
            textAlignVertical: 'top',
        },
    })
};
