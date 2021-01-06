/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Avatar, Bubble, SystemMessage, Message, MessageText} from 'react-native-gifted-chat';
import ImageModal from 'react-native-image-modal';
import moment from 'moment';
import {globalStyle} from '../../../../../assets/style';
import {Icon} from 'react-native-elements';

export const renderAvatar = (props) => {
    // console.log('avatar ====> ', props);
    return (
        <View>
            <Avatar
                {...props}
                // containerStyle={{ left: { borderWidth: 3, borderColor: 'red' }, right: {} }}
                // imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' }, right: {} }}
            />
            <Text>{props.currentMessage.user.name}</Text>
        </View>
    );
};

export const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            renderTime={() => (
                <View style={{paddingHorizontal: 10, paddingBottom: 5}}>
                    <Text
                        style={props.currentMessage.user._id !== props.user._id ? styles.leftTimeStyle : styles.rightTimeStyle}>
                        {moment(props.currentMessage.createdAt).format('hh:mm A')}
                    </Text>
                </View>)}
            // renderTicks={() => <Text>Ticks</Text>}
            containerStyle={{
                // left: {backgroundColor: 'blue'},
                right: {},
            }}
            wrapperStyle={{
                left: {backgroundColor: globalStyle.gray_tone_3},
                // left: {backgroundColor: globalStyle.secondary_color_1},
                right: {backgroundColor: globalStyle.primary_color_2},
            }}
            bottomContainerStyle={{
                // left: { borderColor: 'white', borderWidth: 4 },
                right: {},
            }}
            tickStyle={{color: 'red'}}
            usernameStyle={{color: '#fff', fontWeight: '100'}}
            containerToNextStyle={{
                // left: {backgroundColor: 'blue'},
                right: {},
            }}
            containerToPreviousStyle={{
                // left: { borderColor: 'white', borderWidth: 4 },
                right: {},
            }}
        />
    );
};

export const renderSystemMessage = (props) => (
    <SystemMessage
        {...props}
        containerStyle={{backgroundColor: 'pink', height: 50}}
        wrapperStyle={{borderWidth: 1, borderColor: 'white'}}
        textStyle={{color: '#fff', fontWeight: '900'}}
    />
);

export const renderMessage = (props) => (
    <Message
        {...props}
        // renderDay={() => <Text>Date</Text>}
        containerStyle={{
            left: {backgroundColor: '#fff'},
            right: {backgroundColor: '#fff'},
        }}
    />
);

export const renderMessageText = (props) => (
    <MessageText
        {...props}
        containerStyle={{
            // left: {backgroundColor: globalStyle.secondary_color_1, borderRadius: 5, marginTop: -20},
            // right: { marginTop: -20},
        }}
        textStyle={{
            left: {color: '#000'},
            right: {color: '#fff'},
        }}
        linkStyle={{
            left: {color: 'orange'},
            right: {color: 'orange'},
        }}
        customTextStyle={{fontSize: 16, lineHeight: 24}}
    />
);

export const renderMessageImage = (props) => {
    return (
        <View
            style={{
                borderRadius: 15,
                padding: 2,
            }}
        >
            <ImageModal
                resizeMode="contain"
                style={{
                    width: 200,
                    height: 200,
                    padding: 6,
                    borderRadius: 15,
                    resizeMode: 'cover',
                }}
                source={{uri: props.currentMessage.image}}
            />
        </View>
    );
};

export const renderCustomView = (props) => {
    if (props.currentMessage.user._id !== props.user._id) {
        return (
            <View style={{minHeight: 20, alignItems: 'flex-start', paddingHorizontal: 10, paddingTop: 5}}>
                <Text style={{fontWeight: 'bold'}}>
                    {props.currentMessage.user.name}
                </Text>
            </View>
        );
    } else {
        return null;
    }
};

export const renderLoading = (props) => {
    console.log('loading chat ===> ', props);
    return (
        <View style={{flex: 1, height: '100%'}}>
            <ActivityIndicator size="large" color="#0000ff"/>
        </View>
    );
};

export const renderFooter = (props) => {
  return(
      <View style={styles.footerContainer}>
          <Text>Typing ...</Text>
      </View>
  )
};

export const renderScrollToBottomComponent = (props) => {
  return(
      <View>
          <Icon name="chevron-down" type="material-community" color="#fff" size={36}/>
      </View>
  )
};

const styles = StyleSheet.create({
    leftTimeStyle: {
        fontSize: 10,
        color: '#000',
    },
    rightTimeStyle: {
        fontSize: 10,
        color: '#fff',
    },
    footerContainer: {
        paddingBottom: 10,
        paddingHorizontal: 10,
    }
});
