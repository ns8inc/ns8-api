"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require("../client");
const errors = require("../errors");
class Permission {
    constructor(id, description) {
        this.id = id;
        this.description = description;
    }
}
exports.Permission = Permission;
class Application {
}
exports.Application = Application;
function getAll(callback) {
    try {
        if (exports.items)
            callback(null, exports.items);
        else {
            client.get('/v1/applications', function (err, req, res, result) {
                if (err)
                    callback(err);
                else if (!result)
                    callback(new errors.APIError());
                else {
                    exports.items = result.data.applications;
                    callback(null, result.data.applications);
                }
            });
        }
    }
    catch (err) {
        callback(err, null);
    }
}
exports.getAll = getAll;
//# sourceMappingURL=applications.js.map