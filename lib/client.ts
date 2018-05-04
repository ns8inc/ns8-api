import utils = require("ns8-utils");
import restify = require("restify");

//  The global restify client for the API calls

let client: restify.Client = restify.createJsonClient({
    url: utils.config.settings()['apiUrl'],
    version: '*',
    connectTimeout: 10000,
    requestTimeout: 60000 * 5,
    retry: 3
});

export = client;

