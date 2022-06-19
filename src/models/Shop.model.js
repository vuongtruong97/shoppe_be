const mongoose = require('mongoose')
const slugify = require('slugify')

const { Schema } = mongoose

const shopSchema = new Schema(
    {
        shop_name: { type: String },
        shop_contacts: {
            name: String,
            phones: [
                {
                    type: String,
                },
            ],
            address: [
                {
                    type: String,
                },
            ],
            location: String,
            email: String,
        },
        ship_cod: { type: String },
        category: { type: Schema.Types.ObjectId, ref: 'Category' },
        shop_owner: { type: Schema.Types.ObjectId, ref: 'User' },
        follow_count: { type: Number },
        logo_url: { type: String },
        is_offical_shop: { type: Boolean },
        item_count: { type: Number },
        rating_bad: { type: Number },
        rating_good: { type: Number },
        rating_normal: { type: Number },
        rating_start: { type: Number },
        status: { type: String, default: 0 },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

shopSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'shop',
})

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop
