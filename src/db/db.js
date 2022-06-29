const mongoose = require('mongoose')
const { DB_URI } = process.env
const logger = require('../lib/logger.lib')

const connectDB = () => {
    try {
        mongoose.connect(DB_URI)
        logger.info('Connect db success fully')
    } catch (error) {
        logger.error('Connect db failed', error.message)
    }
}

module.exports = { connectDB }
