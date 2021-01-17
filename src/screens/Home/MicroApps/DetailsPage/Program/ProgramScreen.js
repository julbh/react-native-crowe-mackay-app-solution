import React, {Component, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Linking} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {bindActionCreators} from 'redux';
import {getProAction, getProByUrlAction} from '../../../../../redux/actions/programAction';
import {connect} from 'react-redux';
import {Avatar, Card, ListItem} from 'react-native-elements';
import noAvatar from '../../../../../assets/images/no_avatar.png';
import noImage from '../../../../../assets/images/no-image.jpg';
// import {globalStyle} from '../../../../../assets/style';
import jwtDecode from 'jwt-decode';
import moment, {isDate} from 'moment';
import {getSettingsAction, setSettingsAction} from '../../../../../redux/actions/settingsAction';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import {AppSettingsStateContext} from "../../../../../context/AppSettingsContext";

class ProgramScreen extends Component {
    static contextType = AppSettingsStateContext;

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            items: {},
            selectedDate: null,
            cardWidth: 0,
            globalStyle: {},
        };
    }

    componentDidMount() {
        this._isMounted = true;

        const globalStyle = this.context.config.style;
        this.setState({globalStyle: globalStyle});

        // let params = this.props.route.params ? this.props.route.params : this.props.tabData;
        let params = this.props.customTab ? this.props.tabData : this.props.route.params;
        console.log('params ===> ', params);
        if (params?.payload !== undefined) {
            let {fetch_collection, start_date} = params.payload;
            let title = params.title;

            // let user = jwtDecode(this.props.userData.id_token);
            // this.props.getProgram(user.permission);
            this.props.getProByUrl(fetch_collection);

            let today = moment().format('YYYY-MM-DD');
            if (start_date === undefined || !isDate(start_date)) {
                this.setState({selectedDate: today});
            } else {
                this.setState({selectedDate: start_date});
            }
        }

        /*getSettingsService().then((res) => {
            this.props.setSettings(res);
            let settings = res;
            if (!this.state.selectedDate && settings.length) {
                let defaultDate = settings[0].data.RN_CALENDARS_START_DATE;
                if (!isDate(new Date(defaultDate))) {
                    defaultDate = today;
                }
                if (this._isMounted) {
                    this.setState({selectedDate: defaultDate});
                }
            } else if (!this.state.selectedDate) {
                if (this._isMounted) {
                    this.setState({selectedDate: today});
                }
            }
        }).catch(error => {
            if (this._isMounted) {
                this.setState({selectedDate: today});
            }
            this.props.setSettings([]);
        });*/
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        let {params} = this.props.route;
        if (!this.props.programData.loading && this.props.programData.program && params !== undefined) {
            let id = params.id;
            this.props.programData.program.filter(item => item._id === id).forEach(item => {
                this.props.navigation.navigate('ProgramNav', {screen: 'ProgramDetails', params: item});
            });
        }
    }

    render() {
        let {globalStyle} = this.state;

        if (this.props.programData.loading) {
            return (
                <LoadingSpinner/>
            );
        } else {
            return (
                <Agenda
                    onLayout={this.onLayoutImage.bind(this)}
                    testID={'agenda'}
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={this.state.selectedDate}
                    onDayPress={this.onDayPress.bind(this)}
                    onDaychange={this.onDayPress.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    // pastScrollRange={3}
                    // futureScrollRange={3}
                    // scrollEnabled={true}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    theme={{selectedDayBackgroundColor: globalStyle?.primary_color_2}}
                    // markingType={'period'}
                    // markedDates={{
                    //    '2017-05-08': {textColor: '#43515c'},
                    //    '2017-05-09': {textColor: '#43515c'},
                    //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
                    //    '2017-05-21': {startingDay: true, color: 'blue'},
                    //    '2017-05-22': {endingDay: true, color: 'gray'},
                    //    '2017-05-24': {startingDay: true, color: 'gray'},
                    //    '2017-05-25': {color: 'gray'},
                    //    '2017-05-26': {endingDay: true, color: 'gray'}}}
                    // monthFormat={'yyyy'}
                    //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                    // hideExtraDays={false}
                />
            );
        }

    }

    loadItems() {
        setTimeout(() => {
            let proData = this.props.programData.program;
            let newItems = {};
            proData.forEach(item => {
                if (newItems[item.data.date_string] === undefined) {
                    newItems[item.data.date_string] = [];
                }
                newItems[item.data.date_string].push(item);
            });
            const startOfMonth = moment().startOf('month');
            const endOfMonth = moment().endOf('month');
            for (let m = moment(startOfMonth); m.diff(endOfMonth, 'days') <= 0; m.add(1, 'days')) {
                let date = m.format('YYYY-MM-DD');
                if (newItems[date] === undefined) {
                    newItems[date] = [];
                }
            }
            this.setState({
                items: newItems,
            });
        }, 1000);
    };

    renderItem(agenda) {
        let {globalStyle} = this.state;
        let styles = useStyles(globalStyle);
        let item = agenda.data;
        return (
            <Card
                containerStyle={
                    item.status === undefined || item.status !== 'EXPIRED' ?
                        styles.cardContainer
                        :
                        styles.expiredCardContainer
                }>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: '500',
                        paddingTop: 5,
                        marginBottom: 32,
                    }}>
                        {item.time_string}
                    </Text>
                    <Card.Title style={{
                        backgroundColor: globalStyle?.primary_color_1,
                        color: 'white',
                        padding: 10,
                    }}>{item.conference.replace(/_/g, ' ')}</Card.Title>
                </View>

                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate({name: 'ProgramDetails', params: agenda})
                }>
                    <Card.Title style={{
                        fontSize: 24,
                        marginVertical: 10,
                        color: globalStyle?.primary_color_2,
                    }}>
                        {item.title}
                    </Card.Title>
                    {item.event_poster !== '' &&
                    <>
                        {/*<View
                            onLayout={this.onLayoutImage.bind(this)}
                        >
                            <AutoHeightImage
                                width={this.state.cardWidth}
                                source={{uri: item.event_poster}}
                                fallbackSource={{uri: item.event_poster}}
                            />
                        </View>*/}
                        <Card.Image
                            // style={{width: '100%', resizeMode: 'stretch'}}
                            source={item.event_poster === undefined || '' ? noImage : {uri: item.event_poster}}
                            PlaceholderContent={<ActivityIndicator/>}
                        />
                    </>
                    }
                    <Text style={{
                        fontSize: 15,
                        lineHeight: 24,
                        marginVertical: 10,
                        fontFamily: 'Arial',
                    }}>
                        {item.description}
                    </Text>
                </TouchableOpacity>

                {agenda.userInfo !== undefined && agenda.userInfo.map((uInfo, index) => {
                        if (uInfo.data !== undefined) {
                            return <TouchableOpacity
                                key={index}
                                onPress={() =>
                                    this.props.navigation.navigate({
                                        name: 'UserProfilePro',
                                        params: uInfo.data,
                                    })
                                }
                            >
                                <ListItem bottomDivider containerStyle={{backgroundColor: 'transparent'}}>
                                    <Avatar rounded
                                            source={uInfo.data.picture === undefined || '' ? noAvatar : {uri: uInfo.data.picture}}/>
                                    <ListItem.Content>
                                        <ListItem.Title>{uInfo.data.full_name}</ListItem.Title>
                                        <ListItem.Subtitle
                                            style={{color: 'gray'}}
                                            numberOfLines={2}
                                            /*onPress={() => Linking.openURL(item.speaker_profile)}*/>
                                            {/*{'View Profile'}*/}
                                            {uInfo.data.position}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                            </TouchableOpacity>;
                        }
                    },
                )}

                {
                    item.feedback_url !== undefined &&
                    item.feedback_url !== '' &&
                    <TouchableOpacity onPress={() =>
                        this.props.navigation.navigate({name: 'FeedbackScreen', params: agenda})
                    }>
                        <Card.Title
                            style={{fontSize: 12, marginTop: 10}}
                            /*onPress={() => Linking.openURL(item.url)}*/>
                            {'Tell Us What You Think'}
                        </Card.Title>
                    </TouchableOpacity>
                }
            </Card>
        );
    };

    onLayoutImage(e) {
        const width = e.nativeEvent.layout.width;
        // setCardWidth(width);
        this.setState({cardWidth: width});
    }

    renderEmptyDate() {
        let {globalStyle} = this.state;
        let styles = useStyles(globalStyle);

        return (
            <View style={styles.emptyDate}>
                {/*<Text>This is empty date!</Text>*/}
            </View>
        );
    };

    rowHasChanged(r1, r2) {
        // console.log(r1, r2)
        return r1._id !== r2._id;
    };

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    };

    onDayPress(day) {
        // setSelectedDate(day);
        this.setState({
            selectedDate: day,
        });
    };

}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
        spinner: {},
        item: {
            backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17,
        },
        emptyDate: {
            height: 15,
            flex: 1,
            paddingTop: 30,
        },
        cardContainer: {
            borderRadius: 4,
        },
        expiredCardContainer: {
            borderRadius: 4,
            zIndex: 2,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 50,
            },
            shadowOpacity: 0.9,
            shadowRadius: 5,
            elevation: 25,
            opacity: 0.5,
        },
    })
};

const mapStateToProps = state => ({
    programData: state.programData,
    userData: state.userData,
    settingsData: state.settingsData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getProgram: getProAction,
    getProByUrl: getProByUrlAction,
    getSettings: getSettingsAction,
    setSettings: setSettingsAction,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProgramScreen);

