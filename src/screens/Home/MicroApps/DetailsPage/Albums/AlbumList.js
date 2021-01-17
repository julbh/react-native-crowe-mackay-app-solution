import React, { useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import {Image} from 'react-native-elements';
import * as Actions from '../../../../../redux/actions';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import noImage from '../../../../../assets/images/no-image.jpg';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

function LoadingIndicatorView() {
    return (
        <LoadingSpinner/>
    );
}

function AlbumList(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const dispatch = useDispatch();

    let albumData = useSelector(({albumData}) => albumData);
    let userData = useSelector((rootReducer) => rootReducer.userData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let params = props.route.params;
        let id_token = userData.id_token;
        // let {user_id} = (jwtDecode(id_token));

        let url = params.payload.fetch_collection;
        dispatch(Actions.getAlbumsAction(url));
    }, []);

    const openDetails = (item) => {
        dispatch(Actions.setDialogTypeAction(item.data.format, item._id));
        props.navigation.navigate({name: 'AlbumDetails', params: item});
    };

    function renderItem({item}) {
        return (
            <TouchableOpacity onPress={() => openDetails(item)}>
                <View style={{width: 150, marginRight: 10}}>
                    <Image
                        source={item.data === undefined || item.data.picture === ''
                            ? noImage
                            : {uri: item.data.picture}}
                        style={styles.imageContainer}
                    />
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>{item.data.title || ''}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    function renderAlbumsInTag(data) {
        return (
            <FlatList
                showsVerticalScrollIndicator ={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={{paddingBottom: 20}}
            />
        );
    }

    if (albumData.loading || albumData.albums.data === undefined) {
        return <LoadingIndicatorView/>;
    } else if (albumData.albums.data.length === 0) {
        return (
            <View style={styles.nodataView}>
                <Text>
                    No Details
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator ={false}
                showsHorizontalScrollIndicator={false}
            >
                {
                    albumData.albums.tags.map((tag, index) => (
                        <React.Fragment key={index}>
                            <Text style={styles.tagText}>{tag}</Text>
                            {renderAlbumsInTag(albumData.albums.data.filter(o => {
                                return _.includes(o.data.tags, tag);
                            }))}
                        </React.Fragment>
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            height: '100%',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
        },
        nodataView: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageContainer: {
            width: 150,
            height: 150,
        },
        titleContainer: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            top: 30,
            fontSize: 24,
            fontWeight: 'bold',
            color: globalStyle.secondary_color_1,
            textAlign: 'center',
        },
        descriptionContainer: {
            paddingTop: 10,
        },
        description: {
            fontSize: 16,
            color: globalStyle.gray_tone_1,
        },
        tagText: {
            fontSize: 20,
            paddingBottom: 10,
            fontWeight: 'bold',
            color: globalStyle.primary_color_2,
        }
    })
};

export default AlbumList;
