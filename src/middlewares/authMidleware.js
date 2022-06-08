const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { SECRET_KEY } = process.env

const authMiddleWare = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization

        const token = authorization.replace('Bearer ', '')

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthozied, please login!' })
        }
        const decodeData = jwt.verify(token, SECRET_KEY)

        if (!decodeData) {
            return res.status(401).json({ success: false, message: 'Unauthozied, please login!' })
        }

        const { _id } = decodeData
        const user = await User.findOne({ _id: _id, token })

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthozied, please login!' })
        }

        req.user = user

        next()
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

module.exports = authMiddleWare
