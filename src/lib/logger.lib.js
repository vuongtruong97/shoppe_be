const winston = require('winston')
const path = require('path')

const options = {
    info: {
        level: 'info',
        filename: path.join(__dirname, '../app-log/info.log'),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    error: {
        level: 'error',
        filename: path.join(__dirname, '../app-log/error.log'),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
}

module.exports = winston.createLogger({
    // format của log được kết hợp thông qua format.combine
    format: winston.format.combine(
        winston.format.splat(),
        // Định dạng time cho log
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        // thêm màu sắc
        winston.format.colorize(),
        // thiết lập định dạng của log
        winston.format.printf((log) => {
            // nếu log là error hiển thị stack trace còn không hiển thị message của log
            if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`
            return `[${log.timestamp}] [${log.level}] ${log.message}`
        })
    ),
    levels: winston.config.npm.levels,
    transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File(options.info),
        new winston.transports.File(options.error),
    ],
    exitOnError: false,
})

// const CloudWatchTransport = require('winston-aws-cloudwatch')

// const logger = winston.createLogger({
//   transports: [
//     new CloudWatchTransport({
//       logGroupName: '...', // REQUIRED
//       logStreamName: '...', // REQUIRED
//       createLogGroup: true,
//       createLogStream: true,
//       submissionInterval: 2000,
//       submissionRetryCount: 1,
//       batchSize: 20,
//       awsConfig: {
//         accessKeyId: '...',
//         secretAccessKey: '...',
//         region: '...'
//       },
//       formatLog: item =>
//         `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`
//     })
//   ]
// })
