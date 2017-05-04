"use strict";
const utils = require("ns8-utils");
const restify = require("restify");
let client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*'
});
module.exports = client;
//# sourceMappingURL=client.js.map