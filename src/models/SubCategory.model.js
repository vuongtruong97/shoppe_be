const mongoose = require('mongoose')
const slugify = require('slugify')
const { Schema } = mongoose

const subCateSchema = new Schema(
    {
        name: { type: String, index: true },
        display_name: { type: String },
        image: {
            contentType: { type: String },
            data: { type: Buffer },
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        image_url: { type: String },
        slug: { type: String },
        childrens: { type: Array },
    },
    { timestamps: true }
)

const SubCategory = mongoose.model('SubCategory', subCateSchema)

module.exports = SubCategory
