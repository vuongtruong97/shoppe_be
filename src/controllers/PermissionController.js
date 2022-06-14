const Permission = require('../model/Permission.model')
const logger = require('../library/logger.lib')
const _ = require('lodash')
const {
    EXIST_PERM,
    NOT_FOUND,
    ADD_PERMISSION,
    UPDATE_PERMISSION,
    DELETE_PERMISSION,
} = require('../constant/permissionConstant.constant')

module.exports = {
    async addPerm(req, res) {
        try {
            const { permissionName, permissionDescription } = req.body

            const isExist = await Permission.findOne({ permissionName })

            if (isExist) {
                return res.status(201).json({ success: false, message: EXIST_PERM })
            }

            const permission = new Permission({ permissionName, permissionDescription })

            await permission.save()

            res.status(200).json({ success: true })
        } catch (error) {
            logger.error('[Permission Error]', JSON.stringify(error))
            return res.status(500).json({
                success: false,
            })
        }
    },
    async updatePerm(req, res) {
        try {
            const id = req.params.id
            const { permissionName, permissionDescription } = req.body

            const permission = await Permission.findOne({ id: id })

            if (!permission) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }

            const isExistName = await Permission.findOne({ permissionName })

            if (isExistName) {
                return res.status(201).json({ success: false, message: EXIST_PERM })
            }
            const listUpdates = Object.keys(req.body)

            const listAllows = Object.keys(Permission.schema.paths)

            const isAllow = listUpdates.every((update) => listAllows.includes(update))

            if (!isAllow) {
                return res
                    .status(201)
                    .json({ success: false, message: UPDATE_PERMISSION.UPDATE_INVALID })
            }

            const isUpdated = await Permission.findOneAndUpdate(
                { id: id },
                { permissionName, permissionDescription }
            )

            if (!isUpdated) {
                return res
                    .status(400)
                    .json({ success: false, message: UPDATE_PERMISSION.UPDATE_FAIL })
            }

            ///

            return res
                .status(200)
                .json({ success: true, message: UPDATE_PERMISSION.UPDATE_SUCCESS })
        } catch (error) {
            logger.error('[Permission Error]', JSON.stringify(error))
            return res.status(500).json({
                success: false,
                [error.name]: error.message,
            })
        }
    },
    async deletePerm(req, res) {
        try {
            const { id } = req.params

            const perm = await Permission.findOne({ id })

            if (!perm) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }

            await perm.remove()

            return res
                .status(200)
                .json({ success: true, message: DELETE_PERMISSION.DELETE_SUCCESS })
        } catch (error) {
            logger.error('[Permission Error]', JSON.stringify(error))
            res.status(500).json({ success: false, [error.name]: error.message })
        }
    },
    async getListPerm(req, res) {
        try {
            const where = {}
            const {
                filter,
                paging = { start: 0, limit: 5 },
                sort = { createdAt: -1 },
            } = req.body
            if (_.get(filter, 'permissionName', false) !== false) {
                where['permissionName'] = {
                    $regex: _.toUpper(filter.firstname.trim()),
                    $options: 'i',
                }
            }
            const listPerms = await Permission.find({ where })
                .skip(paging.start)
                .limit(paging.limit)
                .sort(sort)

            if (!listPerms || _.isArray(listPerms) === false) {
                return res.status(404).json({ success: false, data: [] })
            }
            return res.status(200).json({ success: true, data: listPerms })
        } catch (error) {
            logger.error('[Permission Error]', JSON.stringify(error))
            res.status(500).json({ success: false })
        }
    },
}
