import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

export enum AccountStatus {
    /**
     * active user able to log into the system
     */
    active = 0,
    /**
     * Locked out of the system due to password or other issues
     */
    lockedOut = 1
}

export class Account {
    public id: number;
    public name: string;
    public createdDate: Date;
    public userId: string;
    public appId: string;
    public status: number;
    public ipAddress: string;
}

export function get(params: any, callback: (err?: errors.APIError, account?: Account) => void) {

    try {

        client.get('/v1/accounts/' + params.accountId + '?accessToken=' + params.accessToken, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data.account);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}

export function create(params: any, callback: (err?: errors.APIError, result?: any) => void) {

    try {

        client.post('/v1/accounts', params, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data.account);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}