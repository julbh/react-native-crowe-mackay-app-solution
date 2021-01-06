import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList, SafeAreaView, Animated,
} from 'react-native';
import {Avatar, Image, ListItem} from 'react-native-elements';
import {connect, useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import * as Actions from '../../../redux/actions';
import LoadingScreen from './components/LoadingScreen';
import {DATA} from '../../../services/common';
import {getMicroAppByIdService} from '../../../services/microApps';
import {useAppSettingsState} from "../../../context/AppSettingsContext";

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

const MicroAppScreen = (props) => {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    let dispath = useDispatch();
    let userData = useSelector((rootReducer) => rootReducer.userData);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [refreshing, setRefreshing] = React.useState(false);
    const [microApps, setMicroApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [parents, setParents] = useState([]);

    const ref = useRef(null);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        props.getMicroApps();
        props.setMicroParents([]);
        setParents([]);
        wait(1000).then(() => setRefreshing(false));
    }, []);

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            },
        ).start();
    }, [fadeAnim]);

    useEffect(() => {
        ref.current = true;
        // props.navigation.setParams({navTitle: "Micro App"});
        return () => {
            ref.current = null;
        };
    }, []);

    useEffect(() => {
        console.log('micro app screen');
        props.getMicroApps();
    }, []);

    useEffect(() => {
        let sortedResult = _.sortBy(props.microAppData.microApps, ['order']);
        if (ref.current) {
            setMicroApps(sortedResult);
        }
    }, [props.microAppData.microApps]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            let params = props.route.params;
            if (props.microAppData.microApps.length > 0 && params?.app_id) {
                let app_id = params.app_id;
                console.log('**********', props.microAppData, params);
                getMicroAppByIdService(app_id).then(app_data => {
                    console.log('get micro app by id app_data ===> ', app_data);
                    onClickApp(app_data.data);
                    props.navigation.setParams({...params, app_id: null});
                }).catch(err => {
                    console.log('get micro app by id error ===> ', err);
                    props.navigation.setParams({...params, app_id: null});
                });
            }
        });
        return () => unsubscribe();
    }, [props.navigation, props.route.params?.app_id, props.microAppData]);

    useEffect(() => {
        setLoading(true);
        setParents(props.microAppData.parents);
        let allData = [...props.microAppData.microApps];
        let curParents = [...props.microAppData.parents];
        if (!props.microAppData.parents.length) {
            let sortedResult = _.sortBy(props.microAppData.microApps, ['order']);
            setMicroApps(sortedResult);
            // setMicroApps(props.microAppData.microApps);
        } else {
            curParents.forEach(parent => {
                let tmpObj = _.keyBy(allData, 'id');
                allData = tmpObj[parent].children;
            });
            let sortedResult = _.sortBy(allData, ['order']);
            setMicroApps(sortedResult);
            // setMicroApps(allData);
        }
        setLoading(false);

        let params = props.route.params;
        if (props.microAppData.parents.length > 0) {
            props.navigation.setParams({...params, navTitle: 'Back'});
        } else {
            props.navigation.setParams({...params, navTitle: 'MicroApp'});
        }
        // wait(500).then(() => setLoading(false));
    }, [props.microAppData.parents]);

    const onClickApp = (item) => {
        if (item.class === 'WEB') {
            props.navigation.navigate({name: 'WebDetails', params: item});
        } else if (item.class === 'FOLDER') {
            let curNodes = [...props.microAppData.parents, item.id];
            props.setMicroParents(curNodes);
        } else if (item.class === 'CONTACT_LIST') {
            props.navigation.navigate({name: 'ContactList'});
        } else if (item.class === 'FORM') {
            props.navigation.navigate({name: 'FormScreen', params: {...item, navTitle: item.title}});
        } else if (item.class === 'AGENDA') {
            // props.navigation.navigate({name: 'Agenda', params: item});
            props.navigation.navigate('ProgramNav', {screen: 'ProgramScreen', params: {...item, navTitle: item.title}});
        } else if (item.class === 'ALBUM_LIST') {
            // props.navigation.navigate({name: 'Agenda', params: item});
            props.navigation.navigate('AlbumNav', {screen: 'AlbumList', params: {...item, navTitle: item.title}});
        } else if (item.class === 'DATABASE') {
            // props.navigation.navigate({name: 'Agenda', params: item});
            console.log('go to database list ==> ', item);
            props.navigation.navigate('DatabaseNav', {screen: 'DatabaseList', params: {...item, navTitle: item.title}});
        } else if (item.class === 'WOOCOMMERCE') {
            props.navigation.navigate('WCPageNav',
                {
                    screen: 'CategoryScreen',
                    params: {item},
                },
            );
        }
    };

    const renderLoading = ({item}) => (
        <LoadingScreen/>
    );
    if (props.microAppData.loading || loading) {
        // if (true) {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={DATA}
                    renderItem={renderLoading}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            </SafeAreaView>
        );
    }

    const renderItem = ({item}) => {
        return (
            // <Card containerStyle={{borderRadius: 8, marginBottom: -6}}>
            <TouchableOpacity onPress={() => onClickApp(item)}>
                <ListItem bottomDivider>
                    <Avatar
                        source={{uri: item.icon}}
                        imageProps={{resizeMode: 'contain'}}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.titleStyle}>{item.title}</ListItem.Title>
                        <ListItem.Subtitle style={styles.descriptionStyle}>{item.description}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            </TouchableOpacity>
            // </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View></View>
            <FlatList
                data={microApps}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onRefresh={onRefresh}
                refreshing={refreshing}
                contentContainerStyle={{paddingBottom: 20}}
            />
            {/*</Animated.View>*/}
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
            fontWeight: 'bold',
        },
        descriptionStyle: {
            fontSize: 12,
        },
    })
};

const mapStateToProps = state => ({
    microAppData: state.microAppData,
});

/*const mapDispatchToProps = dispatch => bindActionCreators({
    getMicroApps: Actions.getMicroAppAction,
    setMicroParents: Actions.setMicroParentAction,
}, dispatch);*/

const mapDispatchToProps = dispatch => {
    return {
        getMicroApps: () => dispatch(Actions.getMicroAppAction()),
        setMicroParents: (nodes) => dispatch(Actions.setMicroParentAction(nodes)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MicroAppScreen);
