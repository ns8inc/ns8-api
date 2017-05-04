import utils = require('ns8-utils');
import restify = require('restify');
import client = require('../client');
import accounts = require('./accounts');
import projects = require('./projects');
import errors = require('../errors');

module.exports = function(name: string, password: string, appId: number, callback: Function) {

    try {

        let params = {
            name: name,
            password: password
        };

        //  If the appId is specified, it means the login is for a specific app(product).  Specifying the appId will
        //  check for the existance of an account for the user in that app and pull the user's account object into the authObject.
        if (utils.isNumeric(appId)) {
            params['appId'] = appId;
        }

        client.post('/v1/login', params, function (err, req: any, res: any, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else {
                callback(null, result.data);
            }
        });
    } catch (err) {
        callback(err);
    }
};