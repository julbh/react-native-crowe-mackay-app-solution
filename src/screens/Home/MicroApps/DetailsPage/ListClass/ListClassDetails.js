import React, {useEffect, useState} from 'react';
import MainContainer from '../../../../../components/Layout/MainContainer';
import {Button, Card, Image} from 'react-native-elements';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import noImage from '../../../../../assets/images/no-image.jpg';
import {useAppSettingsState} from '../../../../../context/AppSettingsContext';
import * as Actions from '../../../../../redux/actions';
import TrackPlayer from 'react-native-track-player';
import {useDispatch} from 'react-redux';

export default function ListClassDetails(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};
    const dispatch = useDispatch();

    const [details, setDetails] = useState({});

    useEffect(() => {
        let params = props.route?.params;
        setDetails(params?.item);
        console.log('params ===> ', params);
    }, []);

    const formatPlayList = (item, mode) => {
        let formattedList = [];
        let tmp = {
            id: item.id,
            url: mode === 'MP3' ? item.mp3 : item.mp4,
            title: item.title,
            artist: '',
            description: '',
            artwork: item.img,
            web_links: '',
        };
        formattedList.push(tmp);
        dispatch(Actions.setFormattedListAction(formattedList));
    };

    const startPlay = (item, mode) => {
        formatPlayList(item, mode);
        dispatch(Actions.setPlayModeAction('LIST'));
        dispatch(Actions.setDialogTypeAction(mode, item.id));
        dispatch(Actions.setDialogStateAction(0));
    };

    const handleClick = async (mode) => {
        if (mode === 'LINK') {
            props.navigation.navigate('WebDetails', {landing_url: details.url});
        } else if (mode === 'MP3') {
            await TrackPlayer.reset();
            startPlay(details, mode);
        } else if (mode === 'MP4') {
            startPlay(details, mode);
        }
    }

    return (
        <MainContainer style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>{details.title}</Text>
            </View>
            <Image
                source={Boolean(details?.img) ? {uri: details.img} : noImage}
                style={styles.imageStyle}
            />
            <View style={styles.buttonArea}>
                {Boolean(details?.mp3) && <Button
                    title="MP3"
                    buttonStyle={{...styles.button, backgroundColor: globalStyle.primary_color_2}}
                    containerStyle={styles.buttonContainer}
                    onPress={() => handleClick("MP3")}
                />}
                {Boolean(details?.mp4) && <Button
                    title="MP4"
                    buttonStyle={{...styles.button, backgroundColor: globalStyle.primary_color_2}}
                    containerStyle={styles.buttonContainer}
                    onPress={() => handleClick("MP4")}
                />}
                {Boolean(details?.url) && <Button
                    title="LINK"
                    buttonStyle={{...styles.button, backgroundColor: globalStyle.primary_color_2}}
                    containerStyle={styles.buttonContainer}
                    onPress={() => handleClick("LINK")}
                />}
            </View>
        </MainContainer>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            padding: 20,
            alignItems: 'center',
        },
        titleContainer: {
            paddingVertical: 5,
        },
        titleStyle: {
            fontSize: 22,
        },
        imageStyle: {
            width: Dimensions.get('screen').width - 40,
            height: Dimensions.get('screen').height / 3,
        },
        buttonArea: {
            paddingVertical: 10,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        buttonContainer: {
            paddingVertical: 10,
            width: '80%',
            // alignItems: 'center',
            // justifyContent: 'center',
            // backgroundColor: 'red'
        },
        button: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
    });
};

