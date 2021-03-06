import {createAction} from 'rxstate';

// create action
export const resetHistory = createAction();

// map to socket
const history$ = resetHistory.$
    .map(() => ({history: undefined}));

export default history$;
