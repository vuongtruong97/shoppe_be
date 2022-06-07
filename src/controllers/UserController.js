const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const { SECRET_KEY, EXPERT_KEY } = process.env
const jwt = require('jsonwebtoken')

module.exports = {
    async createUser(req, res) {
        try {
            const { email, password } = req.body

            const existUser = await User.findOne({ email })

            if (existUser) {
                throw new Error('User is exist')
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({ email, password: hashPassword })

            const data = { id: user._id, email: user.email }
            const token = jwt.sign(data, SECRET_KEY, { expiresIn: EXPERT_KEY })
            user.token = token

            await user.save()

            res.status(200).json({ success: true, message: 'Create user successfully', data: token })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    },
}
