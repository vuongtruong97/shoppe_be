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

            const data = { _id: user._id }
            const token = jwt.sign(data, SECRET_KEY, { expiresIn: EXPERT_KEY })
            user.token = token

            await user.save()

            res.status(200).json({ success: true, message: 'Create user successfully', token })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    },
    async logInUser(req, res) {
        try {
            const { email, password } = req.body

            const account = await User.findOne({ email })

            if (!account) {
                throw new Error('Không tìm thấy thông tin tài khoản !')
            }

            const isMatchPassword = await bcrypt.compare(password, account.password)

            if (!isMatchPassword) {
                throw new Error('Mật khẩu không đúng, vui lòng thử lại !')
            }

            const data = { _id: account._id }
            const token = jwt.sign(data, SECRET_KEY, { expiresIn: EXPERT_KEY })
            account.token = token

            await account.save()

            res.status(200).json({ success: true, message: 'Đăng nhập thành công !', token })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    },
    async logoutUser(req, res) {
        const user = req.user

        user.token = undefined

        await user.save()

        res.status(200).json({ succes: true, message: 'Logout success' })
        try {
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    },
}
