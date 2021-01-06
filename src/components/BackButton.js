import React from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {useAppSettingsState} from "../context/AppSettingsContext";

export default function BackButton(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    let {goBack} = props;

    if (Platform.OS === 'android') {
        return (
            <Button
                icon={
                    <Icon
                        type={'material-community'}
                        name="arrow-left"
                        size={24}
                        color={globalStyle?.primary_color_2}
                        containerStyle={{padding: 10}}
                    />
                }
                type={'clear'}
                // iconRight={true}
                containerStyle={{borderRadius: 20, padding: -15, marginLeft: 5, marginRight: 20}}
                buttonStyle={styles.buttonStyle}
                titleStyle={{color: 'rgb(101,102,103)', fontWeight: 'bold'}}
                onPress={goBack}
            />
        );
    } else {
        return (
            <TouchableOpacity onPress={goBack}>
                <Icon
                    type={'feather'}
                    name="chevron-left"
                    size={35}
                    color={globalStyle?.primary_color_2}
                    containerStyle={{marginRight: -5}}
                />
            </TouchableOpacity>
        );
    }
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
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
