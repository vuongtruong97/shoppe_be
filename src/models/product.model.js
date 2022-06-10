const mongoose = require('mongoose')

const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: String,
        description: String,
        quantity: String,
        price: String,
        image: Buffer,
        images: Array,
        brand: String,
        currency: String,
        discount: String,
        shop_name: String,
        sold: Number,
        stock: Number,
        rating: Object,
    },
    { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product
