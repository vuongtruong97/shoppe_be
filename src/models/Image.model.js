<<<<<<< HEAD
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
=======
const mongoose = require('mongoose')

const { Schema } = mongoose

const imageSchema = new Schema({
    content_type: String,
    data: Buffer,
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
>>>>>>> a30e69258abb7728fc1e981be9420856fb279489
