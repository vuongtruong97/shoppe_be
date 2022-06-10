const mongoose = require('mongoose')

const { Schema } = mongoose

const bannerSchema = new Schema(
    {
        placement: { type: String },
        alt: { type: String },
        image_url: { type: String },
        target_url: { type: String },
    },
    { timestamps: true }
)

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner
