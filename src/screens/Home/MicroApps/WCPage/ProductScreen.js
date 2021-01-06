import React, {useEffect, useState} from 'react';
import {Rating, AirbnbRating, Button, Icon} from 'react-native-elements';
import MainContainer from '../../../../components/Layout/MainContainer';
import {Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import {Picker} from '@react-native-picker/picker';
import HTML from "react-native-render-html";
import {useAppSettingsState} from "../../../../context/AppSettingsContext";

export default function ProductScreen(props) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);
    const globalStyle = {...config.style};

    const {route, navigation} = props;
    const [product, setProduct] = useState(null);
    const [attributes, setAttributes] = useState({});
    const [attribute, setAttribute] = useState({});

    useEffect(() => {
        if (route?.params) {
            let prdt = route.params?.product;
            setProduct(prdt);
            /*let tmpAttrs = {};
            prdt?.attributes.map((attr) => {
                let tmpOpts = [];
                attr.options.map((opt) => {
                    let tmp = {
                        label: opt,
                        value: opt,
                    };
                    tmpOpts.push(tmp);
                });
                tmpAttrs = {
                    ...tmpAttrs,
                    [attr.name]: tmpOpts,
                };
            });
            setAttributes(tmpAttrs);*/
        }
    }, []);

    if (!product) {
        return <LoadingSpinner/>;
    }

    return (
        <MainContainer>
            <ScrollView>
                <Image source={{uri: product?.images[0]?.src}} style={styles.image}/>
                <View style={styles.nameContainer}>
                    <View style={styles.nContainer}>
                        <Text style={styles.name}>
                            {product.name}
                        </Text>
                    </View>

                    <View>
                        <View style={styles.ratingContainer}>
                            <Rating imageSize={20} startingValue={3.3}/>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>
                                {`$ ${product.price}`}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.descriptionContainer}>
                    <HTML source={{ html: product?.short_description || '<div></div>' }} contentWidth={200} />
                    {/*<Text style={styles.description}>
                        {product?.short_description.replace(/<p>/g, '').replace(/<\/p>/g, '')}
                    </Text>*/}
                </View>
                <View style={styles.optionContainer}>
                    {
                        product.attributes.map((attr, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <View style={styles.optionTitleContainer}>
                                        <Text style={styles.optionTitle}>{attr.name}</Text>
                                    </View>
                                    <View style={styles.pickerOutline}>
                                        <Picker
                                            selectedValue={attribute[attr.name]}
                                            style={styles.pickerStyle}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setAttribute({
                                                    ...attribute,
                                                    [attr.name]: itemValue,
                                                });
                                            }}
                                        >
                                            {
                                                attr.options.map((item, key) => {
                                                    return (
                                                        <Picker.Item key={key} label={item} value={item}/>
                                                    );
                                                })
                                            }
                                        </Picker>
                                    </View>
                                </React.Fragment>
                            );
                        })
                    }
                </View>
                <View style={styles.actionContainer}>
                    <TextInput style={styles.textInput} keyboardType="numeric"/>
                    <Button
                        title="Add to Cart"
                        type="outline"
                        buttonStyle={styles.buttonStyle}
                        titleStyle={{color: globalStyle?.primary_color_2}}
                        icon={
                            <Icon
                                name="cart-outline"
                                type="material-community"
                                size={20}
                                color={globalStyle?.primary_color_2}
                            />
                        }
                    />
                </View>
            </ScrollView>
        </MainContainer>
    );
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        image: {
            width: Dimensions.get('screen').width,
            height: 200,
        },
        nameContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        name: {
            fontSize: 16,
            color: globalStyle?.primary_color_2,
        },
        nContainer: {
            paddingVertical: 5,
        },
        ratingContainer: {
            paddingVertical: 5,
        },
        priceContainer: {
            alignItems: 'flex-end',
        },
        price: {
            fontSize: 16,
            color: globalStyle?.primary_color_2,
        },
        descriptionContainer: {
            flex: 1,
            padding: 10,
        },
        description: {
            fontSize: 14,
            color: globalStyle?.primary_color_2,
            textAlign: 'center',
        },
        optionContainer: {
            paddingHorizontal: 10,
        },
        optionTitleContainer: {
            paddingTop: 10,
            paddingBottom: 5,
        },
        optionTitle: {
            color: globalStyle?.primary_color_2,
            fontSize: 16,
        },
        pickerOutline: {
            borderWidth: 1,
            borderColor: globalStyle?.gray_tone_3,
            width: '80%',
            borderRadius: 3,
        },
        pickerStyle: {
            height: 50,
            width: '100%',
            color: globalStyle?.black,
        },
        actionContainer: {
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 10,
        },
        textInput: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: globalStyle?.gray_tone_3,
            borderRadius: 5,
            paddingHorizontal: 5,
            height: 45,
            width: 100,
        },
        buttonStyle: {
            height: 45,
            color: globalStyle?.primary_color_2
        }
    })
};
