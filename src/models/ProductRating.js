const mongoose = require('mongoose')
const { Schema } = mongoose

const ratingSchema = new Schema(
    {
        ratingSummary: [{ total: Number, count: [Number] }],
        ratingComment: [
            {
                author: Schema.Types.ObjectId,
                comment: String,
                images_url: [String],
                orderId: Schema.Types.ObjectId,
                productId: Schema.Types.ObjectId,
                ratingStart: Number,
            },
        ],
    },
    { timestamps: true }
)

const Role = mongoose.model('Role', ratingSchema)

module.exports = Role
