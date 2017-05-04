"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require("../client");
const errors = require("../errors");
var AccountStatus;
(function (AccountStatus) {
    AccountStatus[AccountStatus["active"] = 0] = "active";
    AccountStatus[AccountStatus["lockedOut"] = 1] = "lockedOut";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
class Account {
}
exports.Account = Account;
function get(params, callback) {
    try {
        client.get('/v1/accounts/' + params.accountId + '?accessToken=' + params.accessToken, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else
                callback(null, result.data.account);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.get = get;
function create(params, callback) {
    try {
        client.post('/v1/accounts', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else
                callback(null, result.data.account);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.create = create;
//# sourceMappingURL=accounts.js.map