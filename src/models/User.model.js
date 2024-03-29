const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema(
    {
        full_name: { type: String },
        gender: { type: Number },
        birth_day: { type: String },
        not_new_user: { type: Boolean },
        email: { type: String },
        email_verified: { type: Boolean },
        phone: { type: String },
        phone_verified: { type: Boolean },
        password: { type: String, select: false },
        token: { type: String },
        avatar: { type: Buffer },
        avatar_url: { type: String },
        google_id: { type: String },
        facebook_id: { type: String },
        role: { type: String, default: 'USER' },
        shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
