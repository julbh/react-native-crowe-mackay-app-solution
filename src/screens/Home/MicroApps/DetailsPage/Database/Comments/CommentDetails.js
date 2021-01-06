import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import {useAppSettingsState} from "../../../../../../context/AppSettingsContext";

function CommentDetails({route, navigation}) {
    const {config} = useAppSettingsState();
    const styles = useStyles(config.style);

    const [details, setDetails] = useState('');

    useEffect(() => {
       if(route?.params?.details){
           setDetails(route?.params?.details);
       }
    });

    return (
        <SafeAreaView style={styles.container}>
            <Markdown>
                {details}
            </Markdown>
        </SafeAreaView>
    )
}

const useStyles = (globalStyle) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 20,
        }
    })
};

export default CommentDetails;
