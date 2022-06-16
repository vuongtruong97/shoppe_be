const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { SECRET_KEY } = process.env
const { Api401Error } = require('../lib/custom-error-handler/apiError')
const logger = require('../lib/logger.lib')

const authMiddleWare = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization

        if (!authorization) {
            throw new Api401Error('Unauthozied, please login!')
        }

        const token = authorization.replace('Bearer ', '') || null

        if (!token) {
            throw new Api401Error('Unauthozied, please login!')
        }

        const decodeData = jwt.verify(token, SECRET_KEY)

        if (!decodeData) {
            throw new Api401Error('Unauthozied, please login!')
        }

        const { _id } = decodeData
        const user = await User.findOne({ _id: _id, token })

        if (!user) {
            throw new Api401Error('Unauthozied, please login!')
        }

        req.user = user

        next()
    } catch (error) {
        logger.error(error.message)

        res.status(401).json({ success: false, message: error.message })
    }
}

module.exports = authMiddleWare
