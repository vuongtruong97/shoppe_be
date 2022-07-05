const Role = require('../models/Role.model')
const { ADD_ROLE, UPDATE_ROLE, DELETE_ROLE } = require('../constant/role.constant')
const { ACCOUNT_ROLE, ACCOUNT_STATUS } = require('../constant/general.constant')

const {
    Api404Error,
    Api409Error,
    Api422Error,
} = require('../lib/custom-error-handler/apiError')

module.exports = {
    async addRole(req, res, next) {
        try {
            const { name, perms } = req.body

            console.log(req.route)

            // isCorrectRole = Object.values(ACCOUNT_ROLE).includes(name)

            // if (!isCorrectRole) {
            //     throw new Api422Error(ADD_ROLE.INCORRECT_ROLE)
            // }

            const isExist = await Role.findOne({ name: name })

            if (isExist) {
                throw new Api409Error(ADD_ROLE.EXIST_ROLE)
            }

            const role = new Role({ name, perms })

            await role.save()

            return res.json({
                success: true,
                message: ADD_ROLE.CREATE_SUCCESS,
            })
        } catch (error) {
            next(error)
        }
    },
    async updateRole(req, res, next) {
        try {
            const { id } = req.params

            const isExist = await Role.findById(id)

            if (!isExist) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }

            const reqUpdates = Object.keys(req.body)
            const allowUpdates = Object.keys(Role.schema.paths)

            const isAllow = reqUpdates.every((reqUpdate) =>
                allowUpdates.includes(reqUpdate)
            )

            if (!isAllow) {
                return res.status(400).json({
                    success: false,
                    message: UPDATE_ROLE.INVALID_UPDATE,
                })
            }

            reqUpdates.forEach((update) => (role[update] = req.body[update]))

            await role.save()

            return res.status(200).json({ success: true })
        } catch (error) {
            next(error)
        }
    },
    async deleteRole(req, res, next) {
        try {
            const { id } = req.params
            const role = await Role.findById(id)
            if (!role) {
                return res.status(404).json({ success: false, message: NOT_FOUND })
            }
            await role.remove()

            return res
                .status(200)
                .json({ success: true, message: DELETE_ROLE.DELETE_SUCCESS })
        } catch (error) {
            next(error)
        }
    },
    async getAllRole(req, res, next) {
        try {
            const roles = await Role.find()

            res.status(200).json({ success: true, roles })
        } catch (error) {
            next(error)
        }
    },
}
