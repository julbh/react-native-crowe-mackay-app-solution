import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Image} from 'react-native-elements';
import {useAppSettingsState} from "../../../../../context/AppSettingsContext";

export default function ProductItem(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const {product} = props;

    console.log('product ===> ', product);

    return (
        <View style={[styles.wrapperContainer]}>
            <View>
                <Image
                    source={{uri: product.images[0].src}}
                    style={styles.productImage}
                />
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{`$ ${product.price}`}</Text>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{product.name}</Text>
                </View>
            </View>
            {/*<View
                style={[styles.content, styles.contentDisplay]}
            >
                <Text style={styles.categoryName}>{product.name || 'Product'}</Text>
            </View>*/}
        </View>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        wrapperContainer: {
            padding: 20,
            width: Dimensions.get('screen').width / 2,
            // height: Dimensions.get('screen').width / 2,
            alignItems: 'center',
        },
        content: {
            height: '100%',
            backgroundColor: globalStyle.gray_tone_3,
            shadowColor: '#000',
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
        },
        productImage: {
            width: 150,
            height: 150,
        },
        priceContainer: {
            alignItems: 'center',
        },
        price: {
            fontSize: 16,
            color: globalStyle.primary_color_2,
        },
        nameContainer: {
            alignItems: 'center',
        },
        name: {
            fontSize: 14,
            color: globalStyle.primary_color_2,
            textAlign: 'center',
        },
    })
};
