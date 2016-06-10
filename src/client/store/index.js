import {createStore} from 'rxstate';

// get defaul state
import defaultState from './defaultState';

// get custom combinator
import {combinator} from './cominator';

// plug in auth actions
import authStatus from './auth/status';
import register$, {registerUser} from './auth/register';
import login$, {loginUser} from './auth/login';
import resetAuth$, {resetAuth} from './auth/resetAuth';
import {closeUpdates} from './auth/connect';
import getUpdates$, {getUpdates} from './auth/updates';

// team actions
import teamStatus from './team/status';
import createTeam$, {createTeam} from './team/create';
import getTeams$, {getTeams} from './team/get';
import getTeam$, {getTeam} from './team/getTeam';
import setTeam$, {setTeam} from './team/set';
import inviteUser$, {inviteUser} from './team/invite';
import joinTeam$, {joinTeam} from './team/join';
import resetNewTeam$, {resetNewTeam} from './team/resetNew';
import getPublicTeams$, {getPublicTeams} from './team/getPublic';
import updateTeam$, {updateTeam} from './team/update';

// channel actions
import channelStatus from './channel/status';
import createChannel$, {createChannel} from './channel/create';
import getChannels$, {getChannels} from './channel/get';
import getPublicChannels$, {getPublicChannels} from './channel/getPublic';
import setChannel$, {setChannel} from './channel/set';
import resetNewChannel$, {resetNewChannel} from './channel/resetNew';
import resetChannels$, {resetChannels} from './channel/resetChannels';
import updateChannel$, {updateChannel} from './channel/update';
import deleteChannel$, {deleteChannel} from './channel/delete';
import joinChannel$, {joinChannel} from './channel/join';

// chat actions
import chatStatus from './chat/status';
import {initChat, closeChat} from './chat/connect';
import getChat$, {getChat} from './chat/get';
import getHistory$, {getHistory} from './chat/getHistory';
import sendChat$, {sendChat} from './chat/send';
import replyTo$, {replyTo} from './chat/replyTo';
import resetReply$, {resetReply} from './chat/resetReply';
import markRead$, {markRead} from './chat/markRead';
import resetHistory$, {resetHistory} from './chat/resetHistory';
import updateMessage$, {updateMessage} from './chat/update';
import editLastMessage$, {editLastMessage} from './chat/editLastMessage';
import editSelectedMessage$, {editSelectedMessage} from './chat/editSelectedMessage';

// infobar actions
import infobar$, {setInfobar} from './infobar/set';

// user actions
import userStatus from './user/status';
import findUser$, {findUser} from './user/find';
import startDM$, {startDM} from './user/startdm';

// notifications
import notificationStatus from './notifications/status';
import notifications$, {getNotifications} from './notifications/get';
import notificationsReg$, {registerNotifications} from './notifications/register';

// create an array of action streams for store
const streams = [
    // auth streams
    authStatus.$,
    register$,
    login$,
    resetAuth$,
    getUpdates$,
    // team streams
    teamStatus.$,
    getTeams$,
    getTeam$,
    createTeam$,
    setTeam$,
    inviteUser$,
    joinTeam$,
    resetNewTeam$,
    getPublicTeams$,
    updateTeam$,
    // channel streams
    channelStatus.$,
    getChannels$,
    getPublicChannels$,
    createChannel$,
    setChannel$,
    resetNewChannel$,
    resetChannels$,
    updateChannel$,
    deleteChannel$,
    joinChannel$,
    // chat streams
    chatStatus.$,
    getChat$,
    getHistory$,
    sendChat$,
    replyTo$,
    resetReply$,
    markRead$,
    resetHistory$,
    updateMessage$,
    editLastMessage$,
    editSelectedMessage$,
    // infobar streams
    infobar$,
    // user streams
    userStatus.$,
    findUser$,
    startDM$,
    // notifications
    notificationStatus.$,
    notifications$,
    notificationsReg$,
];
// create store
const store = createStore({streams, defaultState, combinator});

export {
    // auth
    registerUser,
    loginUser,
    resetAuth,
    closeUpdates,
    getUpdates,
    // team
    getTeams,
    getTeam,
    createTeam,
    setTeam,
    inviteUser,
    joinTeam,
    resetNewTeam,
    getPublicTeams,
    updateTeam,
    // channel
    getChannels,
    getPublicChannels,
    createChannel,
    setChannel,
    resetNewChannel,
    resetChannels,
    updateChannel,
    deleteChannel,
    joinChannel,
    // chat
    initChat,
    closeChat,
    getChat,
    getHistory,
    sendChat,
    replyTo,
    resetReply,
    markRead,
    resetHistory,
    updateMessage,
    editLastMessage,
    editSelectedMessage,
    // infobar
    setInfobar,
    // users
    findUser,
    startDM,
    // notifications
    getNotifications,
    registerNotifications,
};

// store
// .distinctUntilChanged(d => d, (a, b) => a.equals(b))
// .subscribe(s => console.log(JSON.stringify(s.toJS(), null, 2)));

export default store;
