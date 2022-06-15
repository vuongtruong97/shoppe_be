const mongoose = require('mongoose')
const redis = require('redis')
const { DB_URI, REDIS_URI, REDIS_PASS } = process.env
const logger = require('../lib/logger.lib')

const redisClient = redis.createClient({
    url: `redis://${REDIS_URI}`,
    password: REDIS_PASS,
})
// redisClient = redis.createClient({ return_buffers: true })

const connectDB = () => {
    try {
        mongoose.connect(DB_URI)
        logger.info('Connect db success fully')
    } catch (error) {
        logger.error('Connect db failed', error.message)
    }
}
const connectRedis = async () => {
    try {
        redisClient.on('error', function (err) {
            logger.error('Could not establish a connection with redis. ' + err)
        })
        redisClient.on('connect', function (err) {
            logger.info('Connected to redis successfully')
        })

        await redisClient.connect()
    } catch (error) {
        logger.error(error)
    }
}

module.exports = { connectDB, connectRedis, redisClient }
