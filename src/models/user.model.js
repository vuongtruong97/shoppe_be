const mongoose = require('mongoose')
const slugify = require('slugify')

const { Schema } = mongoose

const userSchema = new Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
        email: { type: String },
        password: { type: String },
        token: { type: String },
        avatar: { type: Buffer },
        googleId: { type: String },
        facebookId: { type: String },
        role: { type: String, default: 'USER' },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
