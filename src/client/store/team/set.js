import {createAction} from 'rxstate';
import {resetChannels} from '../channel/resetChannels';
import {resetHistory} from '../chat/resetHistory';

// create action
export const setTeam = createAction();

// map to request
const team$ = setTeam.$
    .throttle(300)
    .distinctUntilChanged()
    .do(() => resetChannels())
    .do(() => resetHistory())
    .map(currentTeam => ({currentTeam}));

export default team$;
