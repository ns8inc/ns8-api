import client = require("../client");
import utils = require("ns8-utils");

/**
 * Log an application error to the api host.
 * @param a1
 * @param a2
 * @param a3
 * @param a4
 * @param a5
 */
export function log(a1, a2?, a3?, a4?, a5?) {

    let errors: any = {};

    try {

        if (utils.isNumeric(utils.config.settings()['appId']))
            errors.appId = utils.config.settings()['appId'];

        if (a1) errors['data1'] = a1;
        if (a2) errors['data2'] = a2;
        if (a3) errors['data3'] = a3;
        if (a4) errors['data4'] = a4;
        if (a5) errors['data5'] = a5;

        client.post('/v1/ops/logs', errors, function(err, req, res) {

            if (err) {
                console.log('logger after client.post', err);
                console.dir(errors);
            }
        });
    } catch(err) {
        //  nothing to do here except log to console
        console.log(err);
        console.dir(errors);
    }
}
