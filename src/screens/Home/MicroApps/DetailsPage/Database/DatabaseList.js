import React, {useEffect, useReducer, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {dynamicFetch} from '../../../../../services/microApps';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import _ from 'lodash';
import moment from 'moment';
import NoData from '../../../../../components/NoData';
import noAvatar from '../../../../../assets/images/no_avatar.png';
import {toHumanTime} from '../../../../../services/common';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from '../../../../../redux/actions';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

export default function DatabaseList({navigation, route}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const dispatch = useDispatch();
    const dbList = useSelector(({dbList}) => dbList);
    // const list = useSelector(({dbList}) => dbList.data);

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [label, setLabel] = useState(null);
    const [humanShow, setHumanShow] = useState(false);

    useEffect(() => {
        setLoading(true);
        let params = route.params;
        if (params?.payload) {
            setLabel(params.payload.label);
            dynamicFetch(params.payload.path, 'user_id').then((res) => {
                setLoading(false);
                setList(res);
                dispatch(Actions.setDBListAction(res));
            }).catch(err => {
                setLoading(false);
            });
        }
    }, [route, navigation]);

    const onClickItem = (item) => {
        navigation.navigate('DatabaseDetails', {item});
    };

    if (loading || dbList.loading || !dbList.data) {
        return <LoadingSpinner/>;
    }

    if (!loading && dbList.data?.length === 0) {
        return <NoData/>;
    }

    console.log('database list ===> ', dbList, label)

    function renderItem({item}) {
        return <TouchableOpacity onPress={() => onClickItem(item)}>
            <ListItem bottomDivider>
                {item.user &&
                <Avatar
                    rounded
                    size="small"
                    source={item.user.data.picture !== '' && item.user.data.picture !== undefined ? {uri: item.user.data.picture} : noAvatar}/>
                }
                <ListItem.Content>
                    {label && <View style={styles.rowContainer}>
                        <ListItem.Title style={styles.title}>
                            {item?.data[label?.split('.')[0]][label?.split('.')[1]]}
                        </ListItem.Title>
                        <TouchableOpacity onPress={() => setHumanShow(!humanShow)}>
                            {humanShow ? <ListItem.Subtitle style={styles.subTitle}>
                                    {moment(item.createdAt).format('MM/DD/YYYY HH:mm')}
                                </ListItem.Subtitle>
                                :
                                <ListItem.Subtitle style={styles.subTitle}>
                                    {`${toHumanTime(item.createdAt)}`}
                                </ListItem.Subtitle>
                            }
                        </TouchableOpacity>
                    </View>}
                    <ListItem.Subtitle style={styles.subTitle}>
                        {`${item.user?.data.full_name}`}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </TouchableOpacity>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View></View>
            <FlatList
                data={dbList.data}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                // onRefresh={onRefresh}
                // refreshing={refreshing}
                // contentContainerStyle={{paddingBottom: 20}}
            />
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        subTitle: {
            fontSize: 14,
            // marginLeft: 5,
        },
        rowContainer: {
            width: '100%',
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
        },
    })
};
