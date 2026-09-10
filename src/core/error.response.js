'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNAUTHORIZED: 402
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
    UNAUTHORIZED: 'authorized error'
}

class ErrorResponse extends Error {
    constructor(message,status) {
        super(message)
        this.status = status
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN,statusCode = StatusCode.FORBIDDEN) {
        super(message,statusCode)
    }
}
class ConfligRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT,statusCode = StatusCode.CONFLICT) {
        super(message,statusCode)
    }
}
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED,statusCode = StatusCode.UNAUTHORIZED) {
        super(message,statusCode)
    }
}

module.exports = {
    BadRequestError,
    ConfligRequestError,
    AuthFailureError
}