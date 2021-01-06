import {Platform} from 'react-native';

export const globalStyle = {
    primary_color_1: "#FDB913",
    primary_color_2: "#002D62",
    secondary_color_1: "#55C5E9",
    secondary_color_2: "#00AB8E",
    secondary_color_3: "#ED1C24",
    gray_tone_1: '#666666',
    gray_tone_2: '#999999',
    gray_tone_3: '#CCCCCC',
    black: '#000000',
    white: '#FFFFFF',
    common_header_color: '#F2F2F2',

    miniBarMargin: Platform.OS === 'android' ? 50 : 80,
    miniBarHeight: 60,
};
