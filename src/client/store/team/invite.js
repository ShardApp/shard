import {createAction} from 'rxstate';
import status from './status';
import {post, sign} from '../../util';

// create action
export const inviteUser = createAction();

// map to request
const team$ = inviteUser.$
    .do(() => status('loading'))
    .map(data => sign(data))
    .flatMap(({team, ...data}) => post(`/api/teams/${team}/invite`, data))
    .do(res => (res.error ? status('error') : status('finished')))
    .map(res => ({teamError: res.error, invited: !res.error}));

export default team$;
