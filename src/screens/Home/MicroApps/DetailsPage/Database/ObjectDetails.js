import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Image, ListItem} from 'react-native-elements';
import NoData from '../../../../../components/NoData';
import AutoHeightImage from 'react-native-auto-height-image';
import ImageView from 'react-native-image-viewing';
import {getAnythingService} from '../../../../../services/microApps';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import {normalizeKey} from '../../../../../services/common';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

export default function ObjectDetails({navigation, route}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const [item, setItem] = useState(null);
    const [imageView, setImageView] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route?.params?.obj) {
            setItem(route.params.obj);
        } else if (route?.params?._id) {
            setLoading(true);
            getAnythingService(route?.params?._id).then(res => {
                setItem(res.data);
                setLoading(false);
            }).catch(err => {
                setItem({});
                setLoading(false);
            });
        }
    }, [route]);

    const moreDetails = (obj) => {
        navigation.navigate('ObjectDetails', {
            obj,
        });
    };

    String.prototype.isImage = function () {
        return this.includes('png');
    };

    const containImage = (obj) => {
      return (obj.value.includes('png') || obj.key.includes('picture'))
    };

    const openImageView = (image) => {
        setImages([{uri: image}]);
        setImageView(true);
    };

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (!item || item.length === 0) {
        return <NoData/>;
    }
    console.log('item ===> ', item)
    /*_.map(item, (value, key) => {
        try{
            console.log('value, key ===> ', value, key, value.isImage(), typeof value)

        }catch (e) {
            console.log('error ==> ', e,  value, key, typeof value)
        }

    })*/

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                {
                    _.map(item, (value, key) => {
                        return (
                            <React.Fragment key={key}>
                                {Array.isArray(item) ?
                                    <>
                                        {/*{typeof value !== 'boolean' && value.isImage() ? <TouchableOpacity onPress={() => openImageView(value)}>*/}
                                        {typeof value !== 'boolean' && containImage({value, key}) ? <TouchableOpacity onPress={() => openImageView(value)}>
                                                <AutoHeightImage
                                                    width={Dimensions.get('screen').width}
                                                    source={{uri: value}}
                                                    style={styles.image}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <ListItem.Subtitle
                                                style={styles.sutTitle}>{`"${value}"`}</ListItem.Subtitle>}
                                    </>
                                    :
                                    <>
                                        <ListItem.Title style={styles.title}>{normalizeKey(key)}</ListItem.Title>
                                        {
                                            typeof value === 'object' ?
                                                <TouchableOpacity onPress={() => moreDetails(value)}>
                                                    <ListItem.Subtitle
                                                        style={styles.sutTitle}>{`${_.size(value)} attributes { ... }`}</ListItem.Subtitle>
                                                </TouchableOpacity>
                                                :
                                                <>
                                                    {/*{typeof value !== 'boolean' && value.isImage() ?*/}
                                                    {typeof value !== 'boolean' && containImage({value, key}) ?
                                                        <TouchableOpacity onPress={() => openImageView(value)}>
                                                            <AutoHeightImage
                                                                width={Dimensions.get('screen').width}
                                                                source={{uri: value}}
                                                                style={styles.image}
                                                            />
                                                        </TouchableOpacity>
                                                        :
                                                        <ListItem.Subtitle
                                                            style={styles.sutTitle}>{`"${value}"`}</ListItem.Subtitle>}
                                                </>
                                        }
                                    </>
                                }
                                <ImageView
                                    images={images}
                                    imageIndex={0}
                                    visible={imageView}
                                    onRequestClose={() => setImageView(false)}
                                />
                            </React.Fragment>
                        );
                    })
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        content: {
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingTop: 10,
            // paddingVertical: 20,
        },
        sutTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: globalStyle.black,
        },
        title: {
            fontSize: 14,
            paddingTop: 5,
            paddingBottom: 10,
            color: globalStyle.gray_tone_1
        },
        image: {
            marginTop: 5,
            marginBottom: 10,
        },
    })
};
