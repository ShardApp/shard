import _ from 'lodash';
import checkAuth from '../auth/checkAuth';
import {logger, asyncRequest} from '../util';
import {Reply} from '../db';

export default (app) => {
    app.post('/api/chat/:team/:channel/reply/:message', checkAuth, asyncRequest(async (req, res) => {
        const channel = req.params.channel;
        const replyTo = req.params.message;
        const message = _.omit(req.body, ['token']);
        logger.info('new reply: ', {replyTo, message, from: req.userInfo.username, channel});
        const m = new Reply({
            ...message,
            channel,
            replyTo,
            readBy: [req.userInfo.id],
        });
        m.user = req.userInfo;
        await m.saveAll({user: true});
        logger.info('saved new reply:', m);
        res.sendStatus(201);
    }));
};