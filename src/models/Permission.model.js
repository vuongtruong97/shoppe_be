const mongoose = require('mongoose')

const { Schema } = mongoose

const permissionSchema = new Schema(
    {
        permissionName: {
            type: String,
            unique: true,
        },
        permissionDescription: {
            type: String,
        },
    },
    { timestamps: true }
)

const Permission = mongoose.model('Permission', permissionSchema)

module.exports = Permission
