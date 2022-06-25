const logger = require('../../lib/logger.lib')

function isOperationalError(error) {
    console.log('first', error)
    if (error instanceof BaseError) {
        return error.isOperational
    }
    return false
}

// if the Promise is rejected this will catch it
process.on('unhandledRejection', (error) => {
    console.log('second', error)
    throw error
})

// if  unexpected errors
process.on('uncaughtException', (err) => {
    console.log('uncaughtException', error)

    logger.error(`${err.name} ${err.message}`)
    console.log(isOperationalError(err))

    if (!isOperationalError(err)) {
        process.exit(1)
    }
})

function errorHandler(error, req, res, next) {
    console.log('finish', error)

    logger.error(`[${error.name}] : ${error.message}`)

    try {
        return res.status(error.statusCode || 500).json({
            success: false,
            name: error.name,
            message: error.message,
        })
    } catch (error) {
        logger.error(`[${error.name}] : ${error.message}`)
        res.status(error.statusCode || 500).json({
            success: false,
            name: error.name,
            message: error.message,
        })
    }
}

module.exports = errorHandler
