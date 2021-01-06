import React  from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
// import { globalStyle } from '../assets/style';
import { Button, Icon } from 'react-native-elements';
import {useAppSettingsState} from "../context/AppSettingsContext";

export default function BackHeader(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const {goBack, title} = props;

    if (Platform.OS === 'android')
        return (
            <View style={styles.headerContainer}>
                <Button
                    icon={
                        <Icon
                            type={'material-community'}
                            name="arrow-left"
                            size={24}
                            color={globalStyle?.primary_color_2}
                            containerStyle={{ padding: 10 }}
                        />
                    }
                    type={'clear'}
                    containerStyle={{ borderRadius: 20, padding: -15, marginLeft: 5, marginRight: 20, }}
                    buttonStyle={styles.buttonStyle}
                    titleStyle={{ color: 'rgb(101,102,103)', fontWeight: 'bold' }}
                    onPress={goBack}
                />
                <Text style={styles.headerText}>{title || 'Back'}</Text>
            </View>
        );
    else
        return (
            <TouchableOpacity
                onPress={goBack}
            >
                <View style={styles.headerContainerIOS}>
                    <Icon
                        type={'feather'}
                        name="chevron-left"
                        size={35}
                        color={globalStyle?.primary_color_2}
                        containerStyle={{ marginRight: -5 }}
                    />
                    <Text style={styles.headerTextIOS}>{title || 'Back'}</Text>
                </View>
            </TouchableOpacity>
        );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            height: 50,
            alignItems: 'center',
            borderBottomWidth: 2,
            backgroundColor: globalStyle.common_header_color,
            borderBottomColor: globalStyle.gray_tone_3,
        },
        headerContainerIOS: {
            flexDirection: 'row',
            height: 50,
            marginLeft: -4,
            alignItems: 'center',
            paddingTop: 8,
            borderBottomWidth: 0.2,
            backgroundColor: globalStyle.common_header_color,
            borderBottomColor: globalStyle.gray_tone_3,
        },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: globalStyle.primary_color_2,
        },
        headerTextIOS: {
            fontSize: 17,
            color: globalStyle.primary_color_2,
        },
        buttonStyle: {
            width: 42,
            height: 42,
            borderRadius: 30,
            padding: -20,
        },
    })
};
