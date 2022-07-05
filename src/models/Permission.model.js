const mongoose = require('mongoose')

const { Schema } = mongoose

const permissionSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        resource: {
            type: String,
            required: true,
        },
        method: [{ type: String, uppercase: true }],
    },
    { timestamps: true }
)

const Permission = mongoose.model('Permission', permissionSchema)

module.exports = Permission
