const Permission = require('../models/Permission.model')
const _ = require('lodash')
const {
    EXIST_PERM,
    NOT_FOUND,
    ADD_PERMISSION,
    UPDATE_PERMISSION,
    DELETE_PERMISSION,
} = require('../constant/permission.constant')

const {
    Api404Error,
    Api409Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

module.exports = {
    async addPerm(req, res, next) {
        try {
            const { name, resource, method } = req.body

            console.log(method)

            const isExist = await Permission.findOne({ name })

            if (isExist) {
                throw new Api409Error(EXIST_PERM)
            }

            const permission = new Permission({ name, resource, method })

            await permission.save()

            res.status(200).json({ success: true })
        } catch (error) {
            next(error)
        }
    },
    async updatePerm(req, res, next) {
        try {
            const id = req.params.id
            const { permissionName, permissionDescription } = req.body

            const permission = await Permission.findOne({ id: id })

            if (!permission) {
                throw new Api404Error(NOT_FOUND)
            }

            const isExistName = await Permission.findOne({ permissionName })

            if (isExistName) {
                throw new Api409Error(EXIST_PERM)
            }
            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Permission.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                throw new Api422Error(UPDATE_PERMISSION.UPDATE_INVALID)
            }

            const isUpdated = await Permission.findOneAndUpdate(
                { id: id },
                { permissionName, permissionDescription }
            )

            if (!isUpdated) {
                throw new Error(UPDATE_PERMISSION.UPDATE_FAIL)
            }

            return res
                .status(200)
                .json({ success: true, message: UPDATE_PERMISSION.UPDATE_SUCCESS })
        } catch (error) {
            next(error)
        }
    },
    async deletePerm(req, res, next) {
        try {
            const { id } = req.params

            const perm = await Permission.findById(id)

            if (!perm) {
                throw new Api404Error(NOT_FOUND)
            }

            await perm.remove()

            return res
                .status(200)
                .json({ success: true, message: DELETE_PERMISSION.DELETE_SUCCESS })
        } catch (error) {
            next(error)
        }
    },
    async getListPerm(req, res, next) {
        try {
            let { sort = '-_id', skip = 0, limit = 30 } = req.query

            const filter = {}

            const listPerms = await Permission.find({ filter })
                .skip(skip)
                .limit(limit)
                .sort(sort)

            return res.status(200).json({ success: true, data: listPerms })
        } catch (error) {
            next(error)
        }
    },
}
