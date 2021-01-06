import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
// import {WebView} from 'react-native-webview';
import Markdown, {getUniqueID} from 'react-native-markdown-renderer';

const rules = {
    heading1: (node, children, parent, styles) =>
        <Text key={getUniqueID()} style={[styles.heading, styles.heading1]}>
            [{children}]
        </Text>,
    heading2: (node, children, parent, styles) =>
        <Text key={getUniqueID()} style={[styles.heading, styles.heading2]}>
            [{children}]
        </Text>,
    heading3: (node, children, parent, styles) =>
        <Text key={getUniqueID()} style={[styles.heading, styles.heading3]}>
            [{children}]
        </Text>,
}

function ProgramDetails(props) {

    const [mdContent, setMdContent] = useState('');

    useEffect(() => {
        // console.log(props.route.params)
        let mdPath = props.route.params.md;
        fetch(mdPath).then(res => {
            return res.text()
        }).then(res => {
            // console.log(res)
            setMdContent(res);
        })
    })

    return (
        <View style={{
            width: '100%',
            height: '100%',
        }}>
            <Markdown rules={rules}>{mdContent}</Markdown>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        borderBottomWidth: 1,
        borderColor: '#000000',
    },
    heading1: {
        fontSize: 32,
        backgroundColor: '#000000',
        color: '#FFFFFF',
    },
    heading2: {
        fontSize: 24,
    },
    heading3: {
        fontSize: 18,
    },
    heading4: {
        fontSize: 16,
    },
    heading5: {
        fontSize: 13,
    },
    heading6: {
        fontSize: 11,
    }
});

export default ProgramDetails;
