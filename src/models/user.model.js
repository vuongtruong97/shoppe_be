const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema(
    {
        first_name: { type: String },
        last_name: { type: String },
        gender: { type: Number },
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
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
