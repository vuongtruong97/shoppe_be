const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const { SECRET_KEY, EXPERT_KEY } = process.env
const jwt = require('jsonwebtoken')
const userConstants = require('../constant/user.constant')
const { Api404Error, Api409Error } = require('../lib/custom-error-handler/apiError')
const userConstant = require('../constant/user.constant')

module.exports = {
    async createUser(req, res, next) {
        try {
            const {
                email,
                password,
                firstname: first_name,
                lastname: last_name,
            } = req.body

            const existUser = await User.findOne({ email })

            if (existUser) {
                throw new Api409Error(userConstants.EXIST_EMAIL)
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                password: hashPassword,
                first_name,
                last_name,
            })

            const data = { _id: user._id }
            const token = jwt.sign(data, SECRET_KEY, { expiresIn: EXPERT_KEY })
            user.token = token

            await user.save()

            res.status(200).json({
                success: true,
                message: userConstants.CREATE_ACCOUNT.CREATE_SUCCESS,
                token,
            })
        } catch (error) {
            next(error)
        }
    },
    async logInUser(req, res, next) {
        try {
            const { email, password } = req.body

            const account = await User.findOne({ email }).select('password')

            if (!account) {
                throw new Api404Error(userConstants.LOGIN_ACCOUNT.EMAIL_NOT_EXIST)
            }

            const isMatchPassword = await bcrypt.compare(password, account.password)

            if (!isMatchPassword) {
                throw new Error(userConstants.LOGIN_ACCOUNT.LOGIN_FAIL)
            }

            const data = { _id: account._id }

            const token = jwt.sign(data, SECRET_KEY, { expiresIn: EXPERT_KEY })

            account.token = token

            await account.save()

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công !',
                token,
            })
        } catch (error) {
            next(error)
        }
    },
    async logoutUser(req, res, next) {
        const user = req.user

        user.token = undefined

        await user.save()

        res.status(200).json({ success: true, message: 'Logout success' })
        try {
        } catch (error) {
            next(error)
        }
    },
    async getUserInfo(req, res, next) {
        try {
            const data = req.user.toObject()

            delete data.token
            delete data.__v

            return res.status(200).json({
                success: true,
                data,
            })
        } catch (error) {
            next(error)
        }
    },
    async getUserShop(req, res, next) {
        try {
            const { user } = req
            await user.populate('shop')
            console.log(user)

            if (!user.shop) {
                throw new Api404Error(userConstant.NO_SHOP)
            }

            res.json({
                success: true,
                data: user.shop,
            })
        } catch (error) {
            next(error)
        }
    },
}
