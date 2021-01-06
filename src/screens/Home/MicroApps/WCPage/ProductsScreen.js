import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity} from 'react-native';
import {getProductsByCategoryService} from '../../../../services/microApps/wcService';
import MainContainer from '../../../../components/Layout/MainContainer';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import {Col, Row} from 'react-native-responsive-grid-system';
import ProductItem from './components/ProductItem';

export default function ProductsScreen({route, navigation}) {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route?.params) {
            let category = route.params?.category;
            setLoading(true);
            getProductsByCategoryService(category.id).then((res) => {
                setProducts(res);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            });
        }
    }, []);

    function onProductDetails(product) {
        navigation.navigate('ProductScreen', {
            product
        })
    }

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <MainContainer>
            <ScrollView>
                <Row>
                    {products.map((product, index) => {
                            return (
                                <Col key={index} xs={6} sm={4} md={3} lg={3}>
                                    <TouchableOpacity onPress={() => onProductDetails(product)}>
                                        <ProductItem product={product}/>
                                    </TouchableOpacity>
                                </Col>
                            );
                        },
                    )}
                </Row>
            </ScrollView>
        </MainContainer>
    );
}
