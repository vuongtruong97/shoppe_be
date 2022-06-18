const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

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

permissionSchema.plugin(
    AutoIncrement,

    { id: 'Permission_id', inc_field: 'id' }
)
const Permission = mongoose.model('Permission', permissionSchema)

module.exports = Permission
