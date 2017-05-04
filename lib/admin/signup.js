"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("ns8-utils");
const users = require("./users");
let settings = utils.config.settings();
let login = require('./login');
module.exports = function (params, callback) {
    try {
        let user = {
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
        users.create(user, function (err, newuser) {
            if (err) {
                callback(err);
                return;
            }
            login(user.name, user.password, settings.appId, function (err, authorization) {
                callback(err, authorization);
            });
        });
    }
    catch (err) {
        callback(err);
    }
};
//# sourceMappingURL=signup.js.map