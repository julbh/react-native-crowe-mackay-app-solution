import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity} from 'react-native';

import {Avatar, Badge, Card, Icon, ListItem, Text} from 'react-native-elements';
import AutoHeightImage from 'react-native-auto-height-image';
import moment from 'moment';
import human from 'human-time';
import ImageView from 'react-native-image-viewing';
import Markdown from 'react-native-markdown-renderer';
// import {globalStyle} from '../../../../assets/style';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import noImage from '../../../../assets/images/no-image.jpg';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

function FeedDetails(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const [item, setItem] = useState(null);
    const [width, setWidth] = useState(0);
    const [images, setImages] = useState([]);
    const [visible, setIsVisible] = useState(false);

    useEffect(() => {
        let params = props.route.params;
        // console.log('feed details', params);
        // setItem(JSON.parse(params));
        let tmpImages = [];
        params.medias.images.map((item, i) => {
            tmpImages.push({uri: item});
        });
        setImages(tmpImages);
        // setImages(params.medias.images)
        setItem(params);
    }, []);

    const onLayoutImage = (e) => {
        const width = e.nativeEvent.layout.width;
        setWidth(width);
    };

    if (!item) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <ScrollView style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
        }}>
            <View containerStyle={styles.viewContent}>
                <ListItem bottomDivider>
                    <Avatar rounded
                            source={item.userInfo.data.picture === undefined || '' ? noImage : {uri: item.userInfo.data.picture}}/>
                    <ListItem.Content>
                        <ListItem.Title style={styles.titleStyle}>{item.userInfo.data.full_name}</ListItem.Title>
                        <ListItem.Subtitle>{item.userInfo.data.position}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                {
                    item.medias.videos.length === 0 ?
                        <>
                            {(item.data.media[0] !== undefined || item.data.media[0] !== '') &&
                            <TouchableOpacity
                                onPress={() => setIsVisible(true)}
                            >
                                <View onLayout={onLayoutImage}>
                                    {item.data.media[0] !== undefined && item.data.media[0] !== '' &&
                                    <AutoHeightImage
                                        width={width}
                                        source={item.data.media[0] === undefined || item.data.media[0] === '' ? noImage : {uri: item.data.media[0]}}
                                        // fallbackSource={image}
                                    />}
                                </View>
                                {item.data.media.length > 1 &&
                                <Badge
                                    containerStyle={{position: 'absolute', top: 4, right: 4}}
                                    badgeStyle={{backgroundColor: '#00000055'}}
                                    value={`1/${item.data.media.length}`}
                                />}
                            </TouchableOpacity>}
                        </>
                        :
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate({name: 'VideoScreen', params: item.medias.videos})}
                        >
                            <View onLayout={onLayoutImage}
                            >
                                <AutoHeightImage
                                    width={width}
                                    source={item.medias.images[0] === undefined || '' ? noImage : {uri: item.medias.images[0]}}
                                    // fallbackSource={{uri: 'https://i.ibb.co/xH0wv7W/IMG-1699.jpg'}}
                                />
                            </View>
                            <View style={styles.overlayIcon}>
                                <Icon
                                    // raised
                                    // name='play-circle-o'
                                    // type='font-awesome'
                                    name='play-box'
                                    type='material-community'
                                    color={globalStyle?.gray_tone_3}
                                    size={80}
                                />
                            </View>
                        </TouchableOpacity>
                }
                <View style={styles.contentStyle}>
                    <Markdown>{item.data.content}</Markdown>
                </View>
                <Card.Title style={styles.timeStyle}>
                    {human((Date.now() - (new Date(item.updatedAt)).getTime()) / 1000)}
                </Card.Title>
            </View>
            <ImageView
                images={images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        </ScrollView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        viewContent: {
            borderRadius: 8,
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
        contentStyle: {
            marginTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
            textAlign: 'left',
            fontWeight: 'normal',
            fontSize: 14,
        },
        titleStyle: {
            fontWeight: 'bold',
        },
        timeStyle: {
            fontSize: 12,
            textAlign: 'left',
            paddingLeft: 10,
            fontWeight: '200',
        },
////
        overlayIcon: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // opacity: 0,
            // backgroundColor: '#000000',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    })
};

export default FeedDetails;
