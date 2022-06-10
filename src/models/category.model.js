const mongoose = require('mongoose')
const slugify = require('slugify')
const { Schema } = mongoose

const categorySchema = new Schema(
    {
        name: { type: String, index: true },
        display_name: { type: String },
        image: {
            contentType: { type: String },
            data: { type: Buffer },
        },
        image_url: { type: String },
        slug: { type: String },
    },
    { timestamps: true }
)

//create slug
categorySchema.pre('save', function () {
    const category = this
    const slug = slugify(category.name, { lower: true })
    category.slug = slug
})
// update slug
categorySchema.pre('findOneAndUpdate', function () {
    const category = this._update
    const slug = slugify(category.name, { lower: true })
    category.slug = slug
})

//custom toJSON method to hide secret data
categorySchema.methods.toJSON = function () {
    const categories = this
    //convert mongoose document to js object
    const newCategories = categories.toObject()

    if (categories.image.data) {
        newCategories.image_url = `/image/${categories.slug}`
    }

    return newCategories
}
const Category = mongoose.model('Category', categorySchema)

module.exports = Category
