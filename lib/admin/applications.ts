import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

export class Permission {
    public id: string;
    public description: string;

    constructor(id: string, description?: string) {
        this.id = id;
        this.description = description;
    }
}

export class Application {

    //  module attributes
    public id: number;
    public name: string;
    public description: string;
    public host: string;
    public commissions: boolean;
    public permissions: Array<Permission>;     //  the available permissions for the module

    public reporting: {
        apiEndpoint: string
    };
}

export var items: Array<Application>;

export function getAll(callback: (err?: errors.APIError, result?: Array<Application>) => void) {

    try {

        if (items)
            callback(null, items);
        else {

            client.get('/v1/applications', function(err, req: restify.Request, res: restify.Response, result: any) {

                if (err)                                //  first, check for an exception
                    callback(err);
                else if (!result)                       //  then check for a missing result
                    callback(new errors.APIError());
                else {
                    items = result.data.applications;
                    callback(null, result.data.applications);        //  finally, return the payload
                }
            });
        }
    } catch(err){
        callback(err, null);
    }

}