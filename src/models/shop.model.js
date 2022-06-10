const mongoose = require('mongoose')
const slugify = require('slugify')

const { Schema } = mongoose

const shopSchema = new Schema(
    {
        user: { type: Object },
        follow_count: { type: Number },
        is_offical_shop: { type: Boolean },
        item_count: { type: Number },
        name: { type: String },
        place: { type: String },
        rating_bad: { type: Number },
        rating_good: { type: Number },
        rating_normal: { type: Number },
        rating_start: { type: Number },
        shop_location: { type: String },
        status: { type: String },
    },
    { timestamps: true }
)

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop
