const morgan = require('morgan')
const json = require('morgan-json')
const logger = require('./logger.lib')

const format = json({
    method: ':method',
    url: ':url',
    status: ':status',
    responseTime: ':response-time',
    remoteAddress: ':remote-addr',
})

const httpLogger = morgan(format, {
    stream: {
        write: (message) => {
            const { method, url, status, remoteAddress, responseTime } =
                JSON.parse(message)
            logger.log(
                `HTTP Log: [IP:${remoteAddress}] [${method}]-[PATH:${url}]-[CODE:${status}] RESPONSE-TIME: ${Number(
                    responseTime
                )}`
            )
        },
    },
})

module.exports = httpLogger
