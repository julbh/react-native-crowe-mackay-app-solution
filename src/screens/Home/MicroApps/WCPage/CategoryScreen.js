import React, {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MainContainer from '../../../../components/Layout/MainContainer';
import {Col, Row} from 'react-native-responsive-grid-system';
import CategoryItem from './components/CategoryItem';
import {getCategoriesService} from '../../../../services/microApps/wcService';
import LoadingSpinner from '../../../../components/LoadingSpinner';

export default function CategoryScreen({route, navigation}) {

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (route?.params) {
            let item = route?.params.item;
            setLoading(true);
            getCategoriesService(item.payload).then(res => {
                setCategories(res);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            });
        }
        /*getCategories().then(res => {
            console.log('category ===> ', res);
        }).catch(err => {
            console.log('')
        })*/
    }, []);

    function onClickCategory(item) {
        navigation.navigate('ProductsScreen', {category: item});
    }

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <MainContainer style={{padding: 0}}>
            <ScrollView>
                <Row>
                    {categories.map((category, index) => {
                            if (category?.slug !== 'uncategorized') {
                                return (
                                    <Col key={index} xs={6} sm={4} md={3} lg={3}>
                                        <TouchableOpacity onPress={() => onClickCategory(category)}>
                                            <CategoryItem category={category}/>
                                        </TouchableOpacity>
                                    </Col>
                                );
                            }
                        },
                    )}
                </Row>
            </ScrollView>
        </MainContainer>
    );
}
