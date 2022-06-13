const mongoose = require('mongoose')

const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: String,
        description: String,
        brand: String,
        guarantee: String,
        expiry: String,
        price: String,
        quantity: String,
        stock: Number,
        status: String,
        main_image: Buffer,
        sub_images: Array,
        videos: Buffer,
        currency: String,
        discount: String,
        shop_name: String,
        sold: Number,
        rating: Object,
    },
    { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product
