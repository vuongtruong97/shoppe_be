const mongoose = require('mongoose')
const { Schema } = mongoose

const roleSchema = new Schema(
    {
        roleName: {
            type: String,
            unique: true,
            uppercase: true,
            required: true,
            trim: true,
        },
        roleDescription: { type: Array, required: true },
    },
    { timestamps: true }
)

const Role = mongoose.model('Role', roleSchema)

module.exports = Role
