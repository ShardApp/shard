import checkAuth from '../auth/checkAuth';
import * as util from '../util';
import {extensions} from '../../../config';
import * as db from '../db';

const {logger} = util;

export default (app) => {
    // setup all server extensions
    const currentExtensions = extensions.map(Ex => {
        const routeString = `/ex/${Ex.extensionName}`;
        const route = app.route(routeString).all(checkAuth);
        logger.debug(`setting up extensions ${Ex.extensionName} with route: "${routeString}"`);
        return new Ex({route, db, util});
    });

    logger.debug('inited extensions:', currentExtensions);
};