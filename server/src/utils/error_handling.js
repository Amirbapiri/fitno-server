const httpStatusCode = require("./http_status_code");

class BaseError extends Error {
    constructor(msg, statusCode, description) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.msg = msg;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

class NotFoundException extends BaseError {
    constructor(
        msg,
        statusCode = httpStatusCode.NOT_FOUND,
        description = "Not found."
    ) {
        super(msg, statusCode, description);
    }
}

class BadRequestException extends BaseError {
    constructor(msg,
        statusCode = httpStatusCode.BAD_REQUEST,
        description = "Bad request."
    ) {
        super(msg, statusCode, description);
    }
}
module.exports = {
    NotFoundException,
    BadRequestException,
}