import {
    ENV_APP_PREFIX,
    ENV_APP_MODE,
    ENV_BASE_URL,
    ENV_X_API_KEY,
    ENV_BEAMS_INSTANCE_ID,
    ENV_BEAMS_SECRET_KEY,
    ENV_CHANNELS_APP_ID,
    ENV_CHANNELS_APP_KEY,
    ENV_CHANNELS_APP_SECRET,
    ENV_CHANNELS_APP_CLUSTER,
} from '@env';

export const app_prefix = ENV_APP_PREFIX;
export const app_mode = ENV_APP_MODE;

export const BASE_URL = ENV_BASE_URL;
export const X_API_KEY = ENV_X_API_KEY;

// for notification using pusher
export const BEAMS_INSTANCE_ID = ENV_BEAMS_INSTANCE_ID;
export const BEAMS_SECRET_KEY = ENV_BEAMS_SECRET_KEY;

// for chat using pusher
export const CHANNELS_APP_ID = ENV_CHANNELS_APP_ID;
export const CHANNELS_APP_KEY = ENV_CHANNELS_APP_KEY;
export const CHANNELS_APP_SECRET = ENV_CHANNELS_APP_SECRET;
export const CHANNELS_APP_CLUSTER = ENV_CHANNELS_APP_CLUSTER;

// variables for chat
export const CHAT_EVENT = `${ENV_APP_PREFIX}CHAT`;
export const SUBSCRIBE_TO_CHANNEL = `${ENV_APP_PREFIX}SUBSCRIBE_TO_CHANNEL`;

export const imageSize = {
    small: 32,
    normal: 50,
};
