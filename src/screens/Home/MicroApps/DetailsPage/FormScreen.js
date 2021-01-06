import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TextInput, Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
// import {globalStyle} from '../../../../assets/style';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import {Avatar, Button, CheckBox, Icon, Image, Input} from 'react-native-elements';
import {Text, Subheading} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
// import TextInputMask from 'react-native-text-input-mask';
import {
    dynamicFetch,
    getAllUsersService,
    sendNotificationService,
    submitFormService
} from '../../../../services/microApps';
import {app_prefix, BEAMS_INSTANCE_ID, BEAMS_SECRET_KEY} from "../../../../config";
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

function LoadingIndicatorView() {
    return (
        <LoadingSpinner/>
    );
}

function FormScreen(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    let userData = useSelector((rootReducer) => rootReducer.userData);
    const [tag, setTag] = useState('');
    const [schema, setSchema] = useState(null);
    const [dynamicItems, setDynamicItems] = useState({});
    const [dynamicValue, setDynamicValue] = useState({});
    // const [dynamicItems, setDynamicItems] = useState([]);
    // const [dynamicValue, setDynamicValue] = useState('');

    const [dropdownItems, setDropdownItems] = useState({});
    const [dropdownItem, setDropdownItem] = useState({});

    const [text, setText] = useState({});
    const [longText, setLongText] = useState({});
    const [images, setImages] = useState([]);
    const [intVal, setIntVal] = useState({});
    const [floatVal, setFloatVal] = useState({});

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [date, setDate] = useState({});
    const [time, setTime] = useState({});
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    const [controller, setController] = useState({});
    const [deeplink, setDeeplink] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isChecked, setIsChecked] = useState(true);
    const [currentUser, setCurrentUser] = useState({});

    const [title, setTtitle] = useState('');

    const ref = useRef(null);

    useEffect(() => {
        ref.current = true;
        return () => ref.current = null;
    });

    useEffect(() => {
        if (props.route?.params) {
            let params = props.route.params;
            if (params?.payload?.deeplink) {
                setDeeplink(params.payload.deeplink);
                // fetch all users
                let id_token = userData.id_token;
                let curUser = (jwtDecode(id_token));
                setCurrentUser(curUser);
                setLoading(true);
                getAllUsersService(curUser.user_id).then((users) => {
                    let tmpUsers = [];
                    users.map((user) => {
                        let tmp = {
                            label: user.data.full_name,
                            value: user._id,
                        };
                        tmpUsers.push(tmp);
                    });
                    if (ref.current){
                        setAllUsers(tmpUsers);
                        setLoading(false);
                    }
                }).catch(err => {
                    setLoading(false);
                })
            }
        }
    }, [props.route]);

    useEffect(() => {
        let params = props.route.params;
        let id_token = userData.id_token;
        let {user_id} = (jwtDecode(id_token));
        console.log('payload===> ', params.payload, params);
        setTag(params.payload.tag);
        setSchema(params.payload.schema);
        setTtitle(params.title);
        ///////////////////////////////////////////////////////////////////////////////////////////
        // let dropdown_array = _.find(params.payload.schema, ['class', 'ARRAY']);
        let d = params.payload.schema.filter(it => it.class === 'ARRAY');
        let tmpItems = {};
        for (let dit of d) {
            let tmpArray = [];
            for (let option of dit.options) {
                let tmp = {
                    label: option,
                    value: option,
                };
                tmpArray.push(tmp);
            }
            tmpItems = {
                ...tmpItems,
                [dit.label]: tmpArray,
            };
        }
        setDropdownItems(tmpItems);
        ////////////////////////////////////////////////////////////////////////////////////////////
        d = params.payload.schema.filter(it => it.class === 'FETCH_ARRAY');
        if (Boolean(d)) {
            for (let fetch_array of d) {
                let keys = fetch_array.fetch_display_key.split('.');
                setLoading(true);
                dynamicFetch(fetch_array.fetch_collection).then((res) => {
                    console.log('fetch array result ==> ', res);
                    // setFetchArray(res);
                    let tmpArray = [];
                    for (let item of res) {
                        let tmp = {
                            label: keys.length === 1 ? item[keys[0]] : item[keys[0]][keys[1]],
                            value: item._id,
                        };
                        tmpArray.push(tmp);
                    }
                    setDynamicItems({
                        ...dynamicItems,
                        [fetch_array.label]: tmpArray
                    });
                    // setDynamicValue(tmpArray[0].value);
                    setLoading(false);
                }).catch(err => {
                    // setFetchArray([]);
                    setLoading(false);
                });
            }
        }
        /*let fetch_array = _.find(params.payload.schema, ['class', 'FETCH_ARRAY']);
        if (fetch_array !== undefined) {
            setLoading(true);
            let keys = fetch_array.fetch_display_key.split('.');
            dynamicFetch(fetch_array.fetch_collection).then((res) => {
                // setFetchArray(res);
                let tmpArray = [];
                for (let item of res) {
                    let tmp = {
                        label: keys.length === 1 ? item[keys[0]] : item[keys[0]][keys[1]],
                        value: item._id,
                    };
                    tmpArray.push(tmp);
                }
                setDynamicItems(tmpArray);
                setDynamicValue(tmpArray[0].value);
                setLoading(false);
            }).catch(err => {
                // setFetchArray([]);
                setLoading(false);
            });
        }*/
        ////////////////////////////////////////////////////////////////////////////////////////////////

    }, []);

    const onChangeDate = (event, selectedDate, item) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate({
            ...date,
            [item.label]: currentDate
        });
    };

    const onChangeTime = (event, selectedDate, item) => {
        const currentDate = selectedDate || time;
        setShowTime(Platform.OS === 'ios');
        setTime({
            ...time,
            [item.label]: currentDate
        });
    };

    const showDatepicker = () => {
        setShowDate(true);
    };

    const showTimepicker = () => {
        setShowTime(true);
    };

    const onSubmit = () => {
        setSaving(true);
        let result = {};
        schema.forEach((item) => {
            switch (item.class) {
                case 'TEXT':
                    result[item.label] = text[item.label] || '';
                    break;
                case 'LONGTEXT':
                    result[item.label] = longText[item.label] || '';
                    break;
                case 'ARRAY':
                    result[item.label] = dropdownItem[item.label] || '';
                    break;
                case 'FETCH_ARRAY':
                    result[item.label] = dynamicValue[item.label] || '';
                    break;
                case 'DATE':
                    result[item.label] = date[item.label].toDateString() || '';
                    break;
                case 'TIME':
                    result[item.label] = moment(time[item.label]).format('HH:mm') || '';
                    break;
                case 'INTEGER':
                    result[item.label] = intVal[item.label] || '';
                    break;
                case 'FLOAT':
                    result[item.label] = floatVal[item.label] || '';
                    break;
                case 'IMAGE_AND_CAMERA':
                    result[item.label] = images[item.label] || '';
                    break;
            }
        });
        let id_token = userData.id_token;
        let {user_id} = (jwtDecode(id_token));
        let submitData = {
            _tag: tag,
            user_id: user_id,
            result,
        };
        console.log('submit data ===> ', submitData);
        // setSaving(false);
        // sendNotification();
        submitFormService(submitData).then(async (res) => {
            console.log('submitted ====> ', res);
            setSaving(false);
            await sendNotification();
        }).catch(err => {
            console.log('error ===> ', err);
            setSaving(false);
        });
    };

    async function sendNotification() {
        if (!isChecked && selectedUsers.length > 0) {
            for (let u of selectedUsers) {
                let payload = {
                    "beam_id": BEAMS_INSTANCE_ID,
                    "beam_secret": BEAMS_SECRET_KEY,
                    'prefix': app_prefix,
                    'title': `You receive a form notification`,
                    'body': `${currentUser.full_name} just filled out ${title}`,
                    'scheme': 'quadreal',
                    'deeplink': deeplink,
                    // receiver_id: currentUser.user_id,
                    receiver_id: u,
                    'sender_id': currentUser.user_id,
                };
                // console.log('payload ===> ', payload, u, currentUser);
                try {
                    await sendNotificationService(payload)
                } catch (e) {
                }
            }
        }
    }

    const renderItem = (item, index) => {
        switch (item.class) {
            case 'TEXT':
                return <View>
                    <TextInput
                        mode={'outlined'}
                        placeholder={item.label}
                        style={{...styles.textInput, height: 45}}
                        // theme={{colors: {primary: globalStyle?.primary_color_2, underlineColor: 'transparent'}}}
                        // label="Email"
                        value={text[item.label] || ''}
                        onChangeText={te => setText(
                            {
                                ...text,
                                [item.label]: te,
                            }
                        )}
                    />
                </View>;
            case 'LONGTEXT':
                return <View>
                    <TextInput
                        mode={'outlined'}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={item.label}
                        style={{...styles.textInput, textAlignVertical: 'top', maxHeight: 90}}
                        // theme={{colors: {primary: globalStyle?.primary_color_2, underlineColor: 'transparent'}}}
                        // label="Email"
                        value={longText[item.label] || ''}
                        onChangeText={text => setLongText({
                            ...longText,
                            [item.label]: text,
                        })}
                    />
                </View>;
            case 'ARRAY':
                return <View style={{...(Platform.OS !== 'android' && {zIndex: 20})}}>
                    <DropDownPicker
                        items={dropdownItems[item.label] || []}
                        defaultValue={dropdownItem[item.label]}
                        style={{backgroundColor: '#fff'}}
                        itemStyle={{
                            justifyContent: 'flex-start', alignItems: 'center', height: 45,
                        }}
                        dropDownStyle={{
                            backgroundColor: '#fff',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                        onChangeItem={it => {
                            setDropdownItem({
                                ...dropdownItem,
                                [item.label]: it.value
                            })
                        }
                        }
                        onOpen={() => {
                            setController({
                                ...controller,
                                [item.label]: true,
                            })
                        }}
                        onClose={() => setController({
                            ...controller,
                            [item.label]: false,
                        })}
                    />
                    {controller[item.label] && <View style={{height: 150}}/>}
                </View>;
            case 'FETCH_ARRAY':
                return <View style={{...(Platform.OS !== 'android' && {zIndex: 10})}}>
                    <DropDownPicker
                        items={dynamicItems[item.label]?.length > 0 ? dynamicItems[item.label] : [{
                            label: 'Loading ... ',
                            value: ''
                        }]}
                        defaultValue={dynamicValue[item.label]}
                        containerStyle={{height: 45}}
                        style={{backgroundColor: '#fff'}}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{backgroundColor: '#fff'}}
                        onChangeItem={it => setDynamicValue({
                            ...dynamicValue,
                            [item.label]: it.value
                        })}
                        searchable={true}
                        searchablePlaceholder="Search for an user"
                        searchablePlaceholderTextColor="gray"
                        seachableStyle={{}}
                        searchableError={() => <Text>Not Found</Text>}
                        onOpen={() => {
                            setController({
                                ...controller,
                                [item.label]: true,
                            })
                        }}
                        onClose={() => setController({
                            ...controller,
                            [item.label]: false,
                        })}
                    />
                    {controller[item.label] && <View style={{height: 150}}/>}
                </View>;
            case 'DATE':
                return <View>
                    <TouchableOpacity onPress={showDatepicker}>
                        <View style={styles.dateInput}>
                            <Icon type={'font-awesome'} name={'calendar-o'} size={20}/>
                            <Text style={{marginLeft: 5}}>
                                {date[item.label]?.toDateString() || (new Date()).toDateString()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {showDate && (
                        <DateTimePicker
                            testID="datePicker"
                            value={date[item.label] || (new Date())}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => onChangeDate(event, selectedDate, item)}
                        />
                    )}
                </View>;
            case 'TIME':
                return <View>
                    <TouchableOpacity onPress={showTimepicker}>
                        <View style={styles.dateInput}>
                            <Icon type={'font-awesome'} name={'clock-o'} size={20}/>
                            <Text style={{marginLeft: 5}}>
                                {Boolean(time[item.label]) ? moment(time[item.label]).format('HH:mm') : moment(new Date()).format('HH:mm')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {showTime && (
                        <DateTimePicker
                            testID="timePicker"
                            value={time[item.label] || (new Date())}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => onChangeTime(event, selectedDate, item)}
                        />
                    )}
                </View>;
            case 'INTEGER':
                return <View>
                    <TextInput
                        mode={'outlined'}
                        keyboardType={'numeric'}
                        placeholder={'0'}
                        style={{...styles.textInput, height: 45}}
                        // theme={{colors: {primary: globalStyle?.primary_color_2, underlineColor: 'transparent'}}}
                        value={intVal[item.label] || ''}
                        onChangeText={text => setIntVal({
                            ...intVal,
                            [item.label]: text
                        })}
                    />
                </View>;
            case 'FLOAT':
                return <View>
                    <TextInput
                        mode={'outlined'}
                        keyboardType={'numeric'}
                        placeholder={'$00.00'}
                        style={{...styles.textInput, height: 45}}
                        // theme={{colors: {primary: globalStyle?.primary_color_2, underlineColor: 'transparent'}}}
                        /* render={props =>
                            <TextInputMask
                                {...props}
                                mask="$[999990].[99]"
                            />
                        } */
                        value={floatVal[item.label] || ''}
                        onChangeText={text => setFloatVal({
                            ...floatVal,
                            [item.label]: text
                        })}
                    />
                </View>;
            /*case 'IMAGE_AND_CAMERA':
                return <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity>
                        <View style={styles.imagePickerArea}>
                            <Icon type={'font-awesome'} name={'camera'} color={'grey'} size={36}/>
                        </View>
                    </TouchableOpacity>
                    <ScrollView horizontal={true}>
                        <Image
                            source={{uri: 'https://image.shutterstock.com/image-photo/woman-using-mobile-smart-phone-600w-1431394355.jpg'}}
                            style={styles.imageStyle}
                        />
                        <Image
                            source={{uri: 'https://image.shutterstock.com/image-photo/woman-using-mobile-smart-phone-600w-1431394355.jpg'}}
                            style={styles.imageStyle}
                        />
                        <Image
                            source={{uri: 'https://image.shutterstock.com/image-photo/woman-using-mobile-smart-phone-600w-1431394355.jpg'}}
                            style={styles.imageStyle}
                        />
                    </ScrollView>
                </View>;*/
            default:
                return <></>;
        }

    };


    if (!schema || loading) {
        return <LoadingIndicatorView/>;
    }

    if (!schema) {
        return (
            <View style={styles.nodataView}>
                <Text>
                    No Details
                </Text>
            </View>
        );
    }
    return (
        <KeyboardAvoidingView style={styles.container}>
            {
                Platform.OS === 'ios' &&
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
            }
            <ScrollView style={styles.formContainer}>
                {
                    schema.map((item, index) =>
                        <React.Fragment key={index}>
                            {item.class !== 'IMAGE_AND_CAMERA' &&
                            <Subheading style={styles.labelText}>{item.label}</Subheading>}
                            {renderItem(item)}
                        </React.Fragment>,
                    )
                }
                <Subheading style={styles.labelText}>Select users to notify</Subheading>
                <View style={{...(Platform.OS !== 'android' && {zIndex: 5})}}>
                    <DropDownPicker
                        multiple={true}
                        multipleText={"%d users have been selected."}
                        items={allUsers.length > 0 ? allUsers : [{label: 'Loading ... ', value: ''}]}
                        defaultValue={selectedUsers}
                        containerStyle={{height: 45}}
                        style={{backgroundColor: '#fff'}}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{backgroundColor: '#fff'}}
                        onChangeItem={item => {
                            console.log('selected ===> ', item);
                            setSelectedUsers(item)
                        }}
                        searchable={true}
                        searchablePlaceholder="Search for an user"
                        placeholder="Select users"
                        searchablePlaceholderTextColor="gray"
                        seachableStyle={{}}
                        searchableError={() => <Text>Not Found</Text>}
                        onOpen={() => {
                            setController({
                                ...controller,
                                ['users']: true,
                            })
                        }}
                        onClose={() => setController({
                            ...controller,
                            ['users']: false,
                        })}
                    />
                    {controller['users'] && <View style={{height: 150}}/>}
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <CheckBox
                        // checkedTitle={`Notify ${formItem?.user?.data.full_name} about your comment`}
                        // title={`Notify ${formItem?.user?.data.full_name} about your comment`}
                        title="Don't send notification"
                        checked={isChecked}
                        onPress={() => setIsChecked(!isChecked)}
                        checkedColor={globalStyle?.primary_color_2}
                        containerStyle={{width: '100%'}}
                    />
                </View>
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
                    containerStyle={{width: '100%', marginBottom: 30, marginTop: 10}}
                    buttonStyle={{backgroundColor: globalStyle?.primary_color_2}}
                    onPress={onSubmit}
                    loading={saving}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        formContainer: {
            padding: 10,
        },
        nodataView: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        inputContainer: {
            paddingVertical: 3,
        },
        labelText: {
            color: globalStyle?.gray_tone_1,
            fontWeight: 'bold',
        },
        dateInput: {
            flexDirection: 'row',
            width: '100%',
            height: 45,
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: '#fff',
            borderColor: globalStyle?.gray_tone_3,
            borderWidth: 1,
            borderRadius: 3,
            alignItems: 'center',
        },
        imagePickerArea: {
            backgroundColor: '#bbbbbb88',
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            borderRadius: 5,
        },
        imageStyle: {
            width: 100,
            height: 100,
            marginHorizontal: 5,
        },
        titleContainer: {
            paddingHorizontal: 5,
            paddingTop: 20,
            alignItems: 'center',
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: globalStyle?.primary_color_2,
        },
        textInput: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: globalStyle?.gray_tone_3,
            borderRadius: 5,
            paddingHorizontal: 5,
        }
    })
};

export default FormScreen;
