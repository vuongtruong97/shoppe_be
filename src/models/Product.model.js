const mongoose = require('mongoose')
const Image = require('./Image.model')

const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: { type: String, index: true },
        description: String,
        guarantee: String,
        expiry: String,
        price: { type: Number, index: true },
        quantity: Number,
        stock: Number,
        status: { type: String, enum: ['NEW', 'OLD', 'LIKE NEW'], default: 'NEW' },
        image_url: String,
        videos: Buffer,
        currency: { type: String, default: 'VND' },
        discount: String,
        shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
        brand: { type: Schema.Types.ObjectId, ref: 'Brand', default: null },
        category: { type: Schema.Types.ObjectId, ref: 'Category' },
        sold: { type: Number, default: 0, index: true },
        rating: { type: Schema.Types.ObjectId },
    },
    { timestamps: true }
)

productSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'doc',
})
productSchema.pre('remove', async function () {
    try {
        const product = this
        const imageId = product.image_url.replace(`${process.env.ROOT_URL}/images/`, '')
        await Image.deleteOne({ _id: imageId })
        console.log('remove', imageId)
    } catch (error) {
        console.log(error)
        return
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
