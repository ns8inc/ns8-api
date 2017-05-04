import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

export enum UserStatus {
    /**
     * active user able to log into the system
     */
    active = 0,
    /**
     * Locked out of the system due to password or other issues
     */
    lockedOut = 1
}

export class User {
    public id: number;
    public name: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public status: UserStatus = UserStatus.active;
    public createdDate: Date;
    public lastUpdated: Date;
    public ipAddress: string;
}

export function create(params: any, callback: (err?: errors.APIError, result?: any) => void) {
    try{

        client.post('/v1/users', params, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data.user);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}

export function authorize(accessToken: string, callback: (err?: errors.APIError, result?: any) => void) {
    try{

        let params = { "accessToken": accessToken };

        client.post('/v1/authorize', params, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}


