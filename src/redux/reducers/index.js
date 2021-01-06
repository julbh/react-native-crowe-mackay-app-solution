import { combineReducers } from 'redux'
import { reducer as network } from 'react-native-offline';
import {feedReducer} from './feedReducer';
import {programReducer} from './programReducer';
import {profileReducer} from './profileReducer';
import {userReducer} from './userReducer';
import {settingsReducer} from './settingsReducer';
import {microAppReducer} from './microAppReducer';
import {inboxReducer} from './inboxReducer';
import {albumReducer} from './albumReducer';
import {playlistReducer} from './playlistReducer';
import {dialogReducer} from './dialogReducer';      // for play screen
import {chatUsersReducer} from './chatReducers/chatUsersReducer';
import {selectedUsersReducer} from './chatReducers/selectedUsersReducer';
import {chatHistoryReducer} from './chatReducers/chatHistoryReducer';
import {chatMessageReducer} from './chatReducers/chatMessageReducer';
import {dbListReducer} from './dbListReducer';
import {appStatusReducer} from './appStatusReducer';
import {commentsReducer} from './commentsReducer';
import {counterReducer} from './counterReducer';

const rootReducer = combineReducers({
    feedData: feedReducer,
    programData: programReducer,
    profileData: profileReducer,
    userData: userReducer,
    settingsData: settingsReducer,
    microAppData: microAppReducer,
    inboxData: inboxReducer,
    albumData: albumReducer,
    playlistData: playlistReducer,
    dialogState: dialogReducer,
    network: network,
    chatUsersReducer: chatUsersReducer,
    selectedUsers: selectedUsersReducer,
    chatHistoryData: chatHistoryReducer,
    chatMessage: chatMessageReducer,
    dbList: dbListReducer,
    appStatus: appStatusReducer,
    commentsData: commentsReducer,
    counterData: counterReducer,
});

export default rootReducer;
