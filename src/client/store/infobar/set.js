import {createAction} from 'rxstate';
import {setInfobarVisible} from './show';

// create action
export const setInfobar = createAction();

// map to request
const infobar$ = setInfobar.$
    .do(() => setInfobarVisible(true))
    .distinctUntilChanged(it => it.id)
    // save last opened bar to re-load it on next page load
    .do(it => it.id && localStorage.setItem('shard.infobar', it.id))
    .map(bar => ({infobar: bar}));

export default infobar$;
