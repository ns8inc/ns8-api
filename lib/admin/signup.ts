import utils = require('ns8-utils');
import users = require('./users');
import accounts = require('./accounts');
import errors = require('../errors');
import api = require('../index');

let settings = utils.config.settings();
let login = require('./login');

module.exports = function(params: any, callback: Function) {

    try {

        let user: any = {
            appId: settings.appId,
            name: params['username'],
            password: params['password'],
            firstName: params['firstName'],
            lastName: params['lastName'],
            email: params['email'],
            couponId: params['couponId'],
            status: 0,
            timezone: params['timezoneId'],
            accountData: params['accountData'],
            accountType: params['accountType']
        };

        if (params['partnerId'])
            user.partnerId = params['partnerId'];
        
        users.create(user, function(err, newuser){

            if (err) {
                callback(err);
                return;
            }

            //  log in to get access token
            login(user.name, user.password, settings.appId, function(err, authorization) {
                callback(err, authorization);
            });
        });
    } catch (err) {
        callback(err);
    }
};
