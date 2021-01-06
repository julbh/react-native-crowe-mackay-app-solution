/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {Image, Text} from 'react-native';
import {InputToolbar, Actions, Composer, Send} from 'react-native-gifted-chat';
import {Icon} from 'react-native-elements';
import {globalStyle} from '../../../../../assets/style';

export const renderInputToolbar = (props) => (
    <InputToolbar
        {...props}
        containerStyle={{
            // backgroundColor: globalStyle.gray_tone_1,
            backgroundColor: globalStyle.common_header_color,
            paddingTop: 6,
        }}
        primaryStyle={{alignItems: 'center'}}
    />
);

export const renderActions = (props) => (
    <Actions
        {...props}
        containerStyle={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 4,
            marginRight: 4,
            marginBottom: 0,
        }}
        icon={() => (
            <Text>😋</Text>
            /*<Image
                style={{width: 32, height: 32}}
                source={{
                    uri: 'https://placeimg.com/32/32/any',
                }}
            />*/
        )}
        options={{
            'Choose From Library': () => {
                console.log('Choose From Library');
            },
            Cancel: () => {
                console.log('Cancel');
            },
        }}
        optionTintColor="#222B45"
    />
);

export const renderComposer = (props) => (
    <Composer
        {...props}
        textInputStyle={{
            color: '#222B45',
            backgroundColor: '#fff',
            // backgroundColor: '#EDF1F7',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#E4E9F2',
            paddingTop: 8.5,
            paddingHorizontal: 12,
            marginLeft: 5,
        }}
    />
);

export const renderSend = (props) => (
    <Send
        {...props}
        disabled={!props.text}
        containerStyle={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 4,
        }}
    >
        <Icon
            // raised
            name='send-outline'
            type='material-community'
            color={globalStyle.primary_color_2}
            // color='#fff'
            size={30}
            // onPress={() => console.log('hello')}
        />
        {/*<Image
      style={{ width: 32, height: 32 }}
      source={{
        uri: 'https://placeimg.com/32/32/any',
      }}
    />*/}
    </Send>
);
