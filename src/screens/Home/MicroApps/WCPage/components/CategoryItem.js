import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

export default function CategoryItem(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const {category} = props;

    return (
        <View style={[styles.wrapperContainer]}>
            <View
                style={[styles.content, styles.contentDisplay]}
            >
                <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            {/*<View>
                <Text>{category.description}</Text>
            </View>*/}
        </View>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        wrapperContainer: {
            padding: 20,
            width: Dimensions.get('screen').width / 2,
            height: Dimensions.get('screen').width / 2,
        },
        content: {
            height: '100%',
            backgroundColor: globalStyle.gray_tone_3,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
        },
        contentDisplay: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        categoryName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: globalStyle.primary_color_2,
        }
    })
};
