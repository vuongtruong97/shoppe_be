const httpStatusCodes = require('./httpStatusCode')
const BaseError = require('./baseError')

class Api404Error extends BaseError {
    constructor(
        description = 'Not found.',
        name = 'Not found',
        statusCode = httpStatusCodes.NOT_FOUND,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

// resource existed
class Api409Error extends BaseError {
    constructor(
        description = 'Existed',
        name = 'Existed',
        statusCode = httpStatusCodes.EXISTED,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

class Api401Error extends BaseError {
    constructor(
        description = 'UNAUTHORIZED',
        name = 'UNAUTHORIZED',
        statusCode = httpStatusCodes.UNAUTHORIZED,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

class Api403Error extends BaseError {
    constructor(
        description = 'FORBIDEN.',
        name = 'FORBIDEN',
        statusCode = httpStatusCodes.FORBIDEN,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

class Api429Error extends BaseError {
    constructor(
        description = 'TOO_MANY_REQUEST.',
        name = 'TOO_MANY_REQUEST',
        statusCode = httpStatusCodes.TOO_MANY_REQUEST,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

class Api422Error extends BaseError {
    constructor(
        description = 'UNPROCESSABLE_ENTITY.',
        name = 'UNPROCESSABLE_ENTITY',
        statusCode = httpStatusCodes.UNPROCESSABLE_ENTITY,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}

module.exports = {
    Api404Error,
    Api409Error,
    Api401Error,
    Api403Error,
    Api429Error,
    Api422Error,
}
