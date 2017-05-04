"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require("../client");
function log(a1, a2, a3, a4, a5) {
    let errors = {};
    try {
        if (a1)
            errors['data1'] = a1;
        if (a2)
            errors['data2'] = a2;
        if (a3)
            errors['data3'] = a3;
        if (a4)
            errors['data4'] = a4;
        if (a5)
            errors['data5'] = a5;
        client.post('/v1/ops/logs', errors, function (err, req, res) {
            if (err) {
                console.log('logger after client.post', err);
                console.dir(errors);
            }
        });
    }
    catch (err) {
        console.log(err);
        console.dir(errors);
    }
}
exports.log = log;
//# sourceMappingURL=logs.js.map