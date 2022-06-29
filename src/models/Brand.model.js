const mongoose = require('mongoose')
const slugify = require('slugify')
const { Schema } = mongoose

const brandSchema = new Schema(
    {
        name: { type: String, index: true },
        display_name: { type: String },
        image: {
            contentType: { type: String },
            data: { type: Buffer },
        },
        image_url: { type: String },
        slug: { type: String },
        childrens: [{ type: Schema.Types.ObjectId }],
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

//virtual field

brandSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'brand',
})

//create slug
brandSchema.pre('save', function () {
    const brand = this
    const slug = slugify(brand.name, { lower: true })
    brand.slug = slug
})
// update slug
brandSchema.pre('findOneAndUpdate', function () {
    const brand = this._update
    const slug = slugify(brand.name, { lower: true })
    brand.slug = slug
})

//custom toJSON method to hide secret data
brandSchema.methods.toJSON = function () {
    const categories = this
    //convert mongoose document to js object
    const newCategories = categories.toObject()

    if (categories.image.data) {
        newCategories.image_url = `/image/${categories.slug}`
    }

    return newCategories
}
const Category = mongoose.model('Category', brandSchema)

module.exports = Category
