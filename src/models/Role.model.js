const mongoose = require('mongoose')
const { Schema } = mongoose

const roleSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            uppercase: true,
            required: true,
            trim: true,
        },
        perms: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    },
    { timestamps: true }
)

const Role = mongoose.model('Role', roleSchema)

module.exports = Role
