const mongoose = require('mongoose')
const redis = require('redis')
const { REDIS_URI, REDIS_PASS } = process.env
const logger = require('../lib/logger.lib')
// const util = require('util')

// redis lab clound
// const redisClient = redis.createClient({
//     url: `redis://${REDIS_URI}`,
//     password: REDIS_PASS,
// })

// redis with computer ram
redisClient = redis.createClient()

// if use redisClien with callback `then().catch().final()`
// redisClient.hGet = util.promisify(redisClient.hGet)

const connectRedis = async () => {
    try {
        redisClient.on('error', function (err) {
            logger.error('Could not establish a connection with redis. ' + err)
        })
        redisClient.on('connect', function (err) {
            logger.info('Connected to redis successfully')
        })

        await redisClient.connect()

        // await redisClient.FLUSHALL()
    } catch (error) {
        logger.error(error)
    }
}

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = { time: 60 }) {
    try {
        this.useCache = true
        this.time = options.time
        this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name)

        return this
    } catch (error) {
        console.log(error)
    }
}

mongoose.Query.prototype.exec = async function () {
    try {
        if (!this.useCache) {
            return await exec.apply(this, arguments)
        }

        const key = JSON.stringify({
            ...this.getFilter(),
            ...this.getOptions(),
        })

        logger.info(`KEY ${key} ${this.hashKey}`)

        const cacheValue = await redisClient.hGet(this.hashKey, key)

        if (cacheValue) {
            const doc = JSON.parse(cacheValue)

            logger.info('Response from Redis')
            return Array.isArray(doc)
                ? doc.map((d) => new this.model(d))
                : new this.model(doc)
        }

        const result = await exec.apply(this, arguments)
        logger.info(this.time)

        await redisClient.hSet(this.hashKey, key, JSON.stringify(result))
        await redisClient.expire(this.hashKey, this.time)

        logger.info('Response from MongoDB')
        return result
    } catch (error) {
        console.log(error)
    }
}

function clearKey(hashKey) {
    redisClient.del(JSON.stringify(hashKey))
}

module.exports = { connectRedis, redisClient, clearKey }
