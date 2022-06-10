const mongoose = require('mongoose')
const slugify = require('slugify')

const { Schema } = mongoose

const userSchema = new Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
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
        googleId: { type: String },
        facebookId: { type: String },
        role: { type: String, default: 'USER' },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
