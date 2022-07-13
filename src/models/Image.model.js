const mongoose = require('mongoose')

const { Schema } = mongoose

const imageSchema = new Schema(
    {
        content_type: String,
        data: Buffer,
    },
    { timestamps: true }
)

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
