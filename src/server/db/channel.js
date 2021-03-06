import {thinky, type} from './thinky';

const channelSchema = {
    name: type.string().required(),
    team: type.string().required(),
    description: type.string(),
    isPrivate: type.boolean().default(false).required(),
    parent: type.string().default('none'),
    type: type.string().enum(['channel', 'conversation']).default('channel'),
    users: [{
        id: type.string(),
        access: type.string().enum(['owner', 'admin', 'member']).default('member'),
    }],
};

export const Channel = thinky.createModel('Channel', channelSchema);
