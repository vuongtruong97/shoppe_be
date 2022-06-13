const mongoose = require('mongoose')
const slugify = require('slugify')

const { Schema } = mongoose

const cartSchema = new Schema(
    {
        cart_items_detail: { type: Array },
        total_cart_item: { type: Number },
        unique_cart_item: { type: Number },
    },
    { timestamps: true }
)

const Shop = mongoose.model('Shop', cartSchema)

module.exports = Shop
