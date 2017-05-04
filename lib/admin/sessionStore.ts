import client = require('../client');
import restify = require('restify');
let util = require('util');

/**
 * Return the `APIStore` extending `express`'s session Store.
 * @param {Function} connect connect-compatible session middleware (e.g. Express 3, express-session)
 */
module.exports = function(connect) {

    let Store = connect.Store || connect.session.Store;

    function APIStore(options) {
        let self = this;
        options = options || {};
        Store.call(this, options);
    }

    util.inherits(APIStore, Store);

    APIStore.prototype.get = function(sid, callback) {

        try {

            client.get('/v1/sessions/' + sid, function (err, req, res, result) {
                try {
                    if (err)
                        return callback(err, null);

                    if (!result.data)
                        return callback();

                    return callback(null, result.data.data);
                } catch (err) {
                    return callback(err);
                }
            });
        } catch(err) {
            return callback(err);
        }
    };

    APIStore.prototype.destroy = function(sid, callback) {
        try {

            client.del('/v1/sessions/' + sid, function (err, req, res) {
                return callback(err);
            });
        } catch(err) {
            return callback(err);
        }
    };

    APIStore.prototype.set = function(sid, data, callback) {

        try {
            let lastAccess = new Date();
            let expires = lastAccess.setDate(lastAccess.getDate() + 1);

            if (typeof data.cookie != 'undefined')
                expires = data.cookie._expires;

            if (typeof data.lastAccess != 'undefined')
                lastAccess = new Date(data.lastAccess);

            let update = {
                data: data,
                lastAccess: lastAccess,
                expires: expires
            };

            client.put('/v1/sessions/' + sid, update, function (err, req, res) {
                try {
                    if (err)
                        return callback(err, null);

                    return callback();
                } catch (err) {
                    return callback(err);
                }
            });
        } catch (err) {
            callback && callback(err);
        }
    };
    return APIStore;
};