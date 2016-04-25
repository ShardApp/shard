import {createStore} from 'rxstate';

// get defaul state
import defaultState from './defaultState';

// plug in auth actions
import authStatus from './auth/status';
import register$, {registerUser} from './auth/register';

// create an array of action streams for store
const streams = [
    // auth streams
    authStatus.$,
    register$,
];
// create store
const store = createStore({streams, defaultState});

export {
    registerUser,
};
export default store;