const mongoose = require('mongoose')

const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: String,
        description: String,
        guarantee: String,
        expiry: String,
        price: String,
        quantity: String,
        stock: Number,
        status: { type: String, enum: ['NEW', 'OLD', 'LIKE NEW'], default: 'NEW' },
        image_url: String,
        videos: Buffer,
        currency: { type: String, default: 'VND' },
        discount: String,
        shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
        brand: { type: Schema.Types.ObjectId, ref: 'Brand', default: null },
        category: { type: Schema.Types.ObjectId, ref: 'Category' },
        sold: { type: Number, default: 0 },
        rating: { type: Schema.Types.ObjectId },
    },
    { timestamps: true }
)

productSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'doc',
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
