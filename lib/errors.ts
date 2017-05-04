/*
    Error class for data errors
 */

export class APIError {
    message: string;
    code: number = 500;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Unknown error';
    }
}

export class InternalError implements APIError {
    public message: string;
    public code: number = 500;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Internal error';
    }
}

export class DuplicateError implements APIError {
    public message: string;
    public code: number = 409;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Conflict';
    }
}

export class NotFoundError implements APIError {
    public message: string;
    public code: number = 404;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Not found';
    }
}

export class MissingParameterError implements APIError {
    public message: string;
    public code: number = 400;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Missing parameter';
    }
}

export class UnauthorizedError implements APIError {
    public message: string;
    public code: number = 401;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Unauthorized';
    }
}

export class BadRequestError implements APIError {
    public message: string;
    public code: number = 400;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Bad request';
    }
}

export class AuthenticationTimeoutError implements APIError {
    public message: string;
    public code: number = 419;

    constructor (message?: string) {

        if (message)
            this.message = message;
        else
            this.message = 'Authentication Timeout';
    }
}