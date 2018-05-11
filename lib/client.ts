import utils = require("ns8-utils");
import restify = require("restify");
import clients = require("restify-clients");

//  The global restify client for the API calls

let client: restify.Client = clients.createJsonClient(<any>{
    url: utils.config.settings()['apiUrl'],
    version: '*',
    connectTimeout: 5000,
    requestTimeout: 60000 * 5,
    agent: false
});

export = client;

