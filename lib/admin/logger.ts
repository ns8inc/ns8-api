import client = require("../client");
import utils = require("ns8-utils");

export enum Levels {
    fatal,
    error,
    warn,
    info,
    trace
}

/**
 * Create a log entry and insert it into the log collection.
 * @param {Levels} level
 * @param items
 */
export function createEntry(level: Levels, items) {
    try {

        // normalize objects
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            //  Error object - have to manually create it or it does not save
            if (typeof item === 'object' && item instanceof Error) {
                items[i] = {
                    error: item.message,
                    name: item.name,
                    stack: item.stack
                }
            }

            //  request object
            if (typeof item === 'object' && item.constructor && item.constructor.name === 'IncomingMessage') {

                items[i] = {
                    user: item.session && item.session.user ? item.session.user.name : undefined,
                    url: item.originalUrl,
                    ip: utils.ip.remoteAddress(item),
                    userAgent: item.headers ? item.headers['user-agent'] : undefined
                };
            }
        }

        let params: any = {
            level: level,
            data: items
        };

        if (utils.isNumeric(utils.config.settings()['appId']))
            params.appId = utils.config.settings()['appId'];

        client.post('/v1/ops/logs', params, function(err, req, res) {

            if (err) {
                console.log('logger after client.post', err);
                console.dir(params);
            }
        });
    } catch(err) {
        console.dir(err);
    }
}

/**
 * Create a fatal level entry.
 * @param items
 */
export function fatal(...items) {
    createEntry(Levels.fatal, items);
}

/**
 * Create an error level entry.
 * @param items
 */
export function error(...items) {
    createEntry(Levels.error, items);
}

/**
 * Create an warning level entry.
 * @param items
 */
export function warn(...items) {
    createEntry(Levels.warn, items);
}

/**
 * Create an info level entry.
 * @param items
 */
export function info(...items) {
    createEntry(Levels.info, items);
}

/**
 * Create a trace level entry.
 * @param items
 */
export function trace(...items) {
    createEntry(Levels.trace, items);
}
