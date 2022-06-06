const mongoose = require('mongoose')

const { DB_URI } = process.env

const connectDB = () => {
    try {
        mongoose.connect(DB_URI)
        console.log('Connect db success fully')
    } catch (error) {
        console.log('Connect db failed', error.message)
    }
}

module.exports = connectDB
