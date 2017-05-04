"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError {
    constructor(message) {
        this.code = 500;
        if (message)
            this.message = message;
        else
            this.message = 'Unknown error';
    }
}
exports.APIError = APIError;
class InternalError {
    constructor(message) {
        this.code = 500;
        if (message)
            this.message = message;
        else
            this.message = 'Internal error';
    }
}
exports.InternalError = InternalError;
class DuplicateError {
    constructor(message) {
        this.code = 409;
        if (message)
            this.message = message;
        else
            this.message = 'Conflict';
    }
}
exports.DuplicateError = DuplicateError;
class NotFoundError {
    constructor(message) {
        this.code = 404;
        if (message)
            this.message = message;
        else
            this.message = 'Not found';
    }
}
exports.NotFoundError = NotFoundError;
class MissingParameterError {
    constructor(message) {
        this.code = 400;
        if (message)
            this.message = message;
        else
            this.message = 'Missing parameter';
    }
}
exports.MissingParameterError = MissingParameterError;
class UnauthorizedError {
    constructor(message) {
        this.code = 401;
        if (message)
            this.message = message;
        else
            this.message = 'Unauthorized';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError {
    constructor(message) {
        this.code = 400;
        if (message)
            this.message = message;
        else
            this.message = 'Bad request';
    }
}
exports.BadRequestError = BadRequestError;
class AuthenticationTimeoutError {
    constructor(message) {
        this.code = 419;
        if (message)
            this.message = message;
        else
            this.message = 'Authentication Timeout';
    }
}
exports.AuthenticationTimeoutError = AuthenticationTimeoutError;
//# sourceMappingURL=errors.js.map