const mongoose = require('mongoose')
const slugify = require('slugify')

const { Schema } = mongoose

const shopSchema = new Schema(
    {
        shop_name: { type: String },
        shop_contacts: {
            name: String,
            phones: String,
            address: String,
            location: String,
            email: String,
        },
        ship_cod: { type: String },
        user: { type: Object },
        follow_count: { type: Number },
        logo_url: { type: String },
        is_offical_shop: { type: Boolean },
        item_count: { type: Number },
        rating_bad: { type: Number },
        rating_good: { type: Number },
        rating_normal: { type: Number },
        rating_start: { type: Number },
        status: { type: String },
    },
    { timestamps: true }
)

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop
