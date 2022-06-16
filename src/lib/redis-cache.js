const { redisClient } = require('../db/db')
const logger = require('./logger.lib')

const DEFAULT_EXPIRATION = 300

const getOrSetCache = async (key, cb, ex = DEFAULT_EXPIRATION) => {
    //get data from redis
    const cacheData = await redisClient.get(key)
    //if has cache return
    if (cacheData !== null) {
        logger.info('cached')
        return JSON.parse(cacheData)
    }
    //else set new data and refresh cache
    const refreshData = await cb()

    await redisClient.setEx(key, ex, JSON.stringify(refreshData))

    return refreshData
}

module.exports = { getOrSetCache }
