'use strict'

const StatusCodes = {
    OK : 200,
    CREATED : 201
}

const ReasonStatusCodes = {
    OK : 200,
    CREATED : 201
}
class SuccessResponse {
    constructor({message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonStatusCodes.OK, metadata = {}}) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res,headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse{
    constructor({message,metadata}) {
        super({message,metadata})
    }
}

class CREATED extends SuccessResponse{
    constructor({message,statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonStatusCodes.CREATED,metadata}) {
        super({message,statusCode,reasonStatusCode,metadata})
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}