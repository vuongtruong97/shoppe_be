const Role = require('../model/Role.model')
const logger = require('../library/logger.lib')
const { ADD_ROLE } = require('../constant/roleConstant.constant')
const {
    ACCOUNT_ROLE,
    UPDATE_ROLE,
    DELETE_ROLE,
    NOT_FOUND,
} = require('../constant/generalConstant.constant')

module.exports = {
    async addRole(req, res) {
        try {
            const { roleName, roleDescription } = req.body

            isCorrectRole = Object.values(ACCOUNT_ROLE).includes(roleName)

            if (!isCorrectRole) {
                return res.status(201).json({
                    success: false,
                    message: ADD_ROLE.INCORRECT_ROLE,
                })
            }

            const isExist = await Role.findOne({ roleName: roleName })

            if (isExist) {
                return res.status(201).json({
                    success: false,
                    message: ADD_ROLE.EXIST_ROLE,
                })
            }

            const role = new Role({ roleName, roleDescription })

            await role.save()

            return res.json({
                success: true,
                message: ADD_ROLE.CREATE_SUCCESS,
            })
        } catch (error) {
            logger.error('[Role Error]', JSON.stringify(error.message))
            res.status(500).json({ success: false, message: error.message })
        }
    },
    async updateRole(req, res) {
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
            logger.error('[Role Error]', JSON.stringify(error))
            res.status(500).json({ success: false, message: error.message })
        }
    },
    async deleteRole(req, res) {
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
            logger.error('[Role Error]', JSON.stringify(error))
            return res.status(500).json({ success: false })
        }
    },
    async getAllRole(req, res) {
        try {
            const roles = await Role.find()

            res.status(200).json({ success: true, roles })
        } catch (error) {
            logger.error('[Role Error]', JSON.stringify(error))
            res.status(500).json({ success: false, message: error.message })
        }
    },
}
