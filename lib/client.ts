import utils = require("ns8-utils");
import restify = require("restify");

//  The global restify client for the API calls

let client: restify.Client = restify.createJsonClient(<any>{
    url: utils.config.settings()['apiUrl'],
    version: '*',
    connectTimeout: 5000,
    requestTimeout: 60000 * 5,
    agent: false,
    retry: {
        'retries': 5
    },
});

export = client;

