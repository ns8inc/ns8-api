import client = require('../client');
import errors = require('../errors');
import restify = require('restify');

export class Permission {
    public id: number;
    public name: string;
    public description: string;

    constructor(id: number, name: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export class Project {

    //  module attributes
    public id: number;
    public accountId: number;
    public name: string;
    public enabled: boolean;
    public data: any;
}

export function get(params: any, callback: (err?: errors.APIError, projects?: Array<Project>) => void) {
    try{

        client.get('/v1/projects?accessToken=' + params.accessToken, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data.projects);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}

export function create(params: any, callback: (err?: errors.APIError, project?: Project) => void) {
    try{

        client.post('/v1/projects', params, function(err, req: restify.Request, res: restify.Response, result: any) {

            if (err)                                //  first, check for an exception
                callback(err);
            else if (!result)                       //  then check for a missing result
                callback(new errors.APIError());
            else
                callback(null, result.data.project);        //  finally, return the payload
        });
    } catch(err) {
        callback(err);
    }
}
