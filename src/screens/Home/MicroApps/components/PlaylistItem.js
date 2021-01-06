import React from 'react';
import {Button, Icon, Image, ListItem} from 'react-native-elements';
import {StyleSheet, Text, View} from 'react-native';
// import {globalStyle} from '../../../../assets/style';
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

function PlaylistItem(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    let {item, downloadMedia, downloading, downloaded} = props;
    let {playlist, users} = item;
    // console.log('===PlaylistItem=====> ', downloading, item);

    return (
        // <View></View>
        <ListItem containerStyle={{paddingHorizontal: 5, paddingVertical: 5}} bottomDivider={true}>
            <Image
                source={{uri: playlist.data.picture}}
                style={styles.listImage}
            />
            <ListItem.Content>
                <ListItem.Title numberOfLines={2} ellipsizeMode="tail">{playlist.data.title}</ListItem.Title>
                <ListItem.Subtitle style={{fontSize: 12}}>{users[0]?.data.full_name}</ListItem.Subtitle>
            </ListItem.Content>
            {/*<ListItem.Content style={{justifyContent: 'flex-end', alignItems: 'flex-end', height: 50}}>*/}
            {/*</ListItem.Content>*/}
            {!downloaded && <Button
                icon={
                    <Icon
                        name='cloud-download'
                        type='font-awesome'
                        size={20}
                        color={globalStyle?.gray_tone_2}
                    />
                }
                loading={downloading[playlist._id] !== undefined && downloading[playlist._id]}
                type={'clear'}
                containerStyle={{borderRadius: 20, marginRight: -10}}
                onPress={downloadMedia}
            />}
            <View>
                <Text style={{
                    fontSize: 12,
                    color: globalStyle?.gray_tone_1,
                }}>{playlist.data.duration_string}</Text>
            </View>
        </ListItem>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        listImage: {
            width: 50,
            height: 50,
        },
    })
};

export default PlaylistItem;
