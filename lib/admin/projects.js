"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require("../client");
const errors = require("../errors");
class Permission {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
exports.Permission = Permission;
class Project {
}
exports.Project = Project;
function get(params, callback) {
    try {
        client.get('/v1/projects?accessToken=' + params.accessToken, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else
                callback(null, result.data.projects);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.get = get;
function create(params, callback) {
    try {
        client.post('/v1/projects', params, function (err, req, res, result) {
            if (err)
                callback(err);
            else if (!result)
                callback(new errors.APIError());
            else
                callback(null, result.data.project);
        });
    }
    catch (err) {
        callback(err);
    }
}
exports.create = create;
//# sourceMappingURL=projects.js.map