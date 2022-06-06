const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const { SECRET_KEY } = process.env

module.exports = {
    async createUser(req, res) {
        try {
            const { email, password } = req.body

            const existUser = await User.findOne({ email })

            if (existUser) {
                throw new Error('User is exist')
            }
            const hashPassword = bcrypt.hash(password, 10)
            const user = new User({ email, password: hashPassword })

            await user.save()

            res.status(200).json({ success: true, message: 'Create user successfully' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    },
}
