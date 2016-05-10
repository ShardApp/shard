import {createStore} from 'rxstate';

// get defaul state
import defaultState from './defaultState';

// plug in auth actions
import authStatus from './auth/status';
import register$, {registerUser} from './auth/register';
import login$, {loginUser} from './auth/login';

// plug in team actions
import teamStatus from './team/status';
import createTeam$, {createTeam} from './team/create';
import getTeams$, {getTeams} from './team/get';
import setTeam$, {setTeam} from './team/set';
import inviteUser$, {inviteUser} from './team/invite';
import resetNewTeam$, {resetNewTeam} from './team/resetNew';

// plug in channel actions
import channelStatus from './channel/status';
import createChannel$, {createChannel} from './channel/create';
import getChannels$, {getChannels} from './channel/get';
import setChannel$, {setChannel} from './channel/set';
import resetNewChannel$, {resetNewChannel} from './channel/resetNew';

// plug in chat actions
import chatStatus from './chat/status';
import {initChat, closeChat} from './chat/connect';
import getChat$, {getChat} from './chat/get';
import getHistory$, {getHistory} from './chat/getHistory';
import sendChat$, {sendChat} from './chat/send';

// create an array of action streams for store
const streams = [
    // auth streams
    authStatus.$,
    register$,
    login$,
    // team streams
    teamStatus.$,
    getTeams$,
    createTeam$,
    setTeam$,
    inviteUser$,
    resetNewTeam$,
    // channel streams
    channelStatus.$,
    getChannels$,
    createChannel$,
    setChannel$,
    resetNewChannel$,
    // chat streams
    chatStatus.$,
    getChat$,
    getHistory$,
    sendChat$,
];
// create store
const store = createStore({streams, defaultState});

export {
    // auth
    registerUser,
    loginUser,
    // team
    getTeams,
    createTeam,
    setTeam,
    inviteUser,
    resetNewTeam,
    // channel
    getChannels,
    createChannel,
    setChannel,
    resetNewChannel,
    // chat
    initChat,
    closeChat,
    getChat,
    getHistory,
    sendChat,
};

// store.subscribe(s => console.log('state update:', s.toJS()));

export default store;
