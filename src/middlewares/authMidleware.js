const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { SECRET_KEY } = process.env

const authMiddleWare = async (req, res, next) => {
    let authorization = req.headers.authorization

    const token = authorization.replace('Bearer ', '')

    console.log('TOKEN', token)

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthozied, please login!' })
    }
    const decodeData = jwt.verify(token, SECRET_KEY)

    console.log('decodeData', decodeData)

    if (!decodeData) {
        return res.status(401).json({ success: false, message: 'Unauthozied, please login!' })
    }
    const { id } = decodeData

    const user = await User.findOne({ _id: id, token })

    console.log('user', user)

    if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthozied, please login!' })
    }

    req.user = user

    next()
}

module.exports = authMiddleWare
