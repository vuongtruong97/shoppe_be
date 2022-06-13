const mongoose = require('mongoose')
const redis = require('redis')
const { DB_URI, REDIS_URI, REDIS_PASS } = process.env

const redisClient = redis.createClient({
    url: `redis://${REDIS_URI}`,
    password: REDIS_PASS,
})
// redisClient = redis.createClient({ return_buffers: true })

const connectDB = () => {
    try {
        mongoose.connect(DB_URI)
        console.log('Connect db success fully')
    } catch (error) {
        console.log('Connect db failed', error.message)
    }
}
const connectRedis = async () => {
    try {
        redisClient.on('error', function (err) {
            console.log('Could not establish a connection with redis. ' + err)
        })
        redisClient.on('connect', function (err) {
            console.log('Connected to redis successfully')
        })

        await redisClient.connect()
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connectDB, connectRedis, redisClient }
