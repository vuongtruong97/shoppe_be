<<<<<<< HEAD
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const { SECRET_KEY, EXPERT_KEY } = process.env
const jwt = require('jsonwebtoken')
const userConstants = require('../constant/user.constant')
const { Api404Error, Api409Error } = require('../lib/custom-error-handler/apiError')
const userConstant = require('../constant/user.constant')
const { redisClient } = require('../db/redis')

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

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            const failedCount = await redisClient.get(`login_failed${ip}`)

            // if login failed over 5 times
            if (failedCount >= 5) {
                const ttl = await redisClient.ttl(`login_failed${ip}`)

                throw new Error(`${userConstant.LOGIN_ACCOUNT.LOGIN_LOCKED} ${ttl}s`)
            }

            if (!isMatchPassword) {
                await redisClient.incr(`login_failed${ip}`)
                await redisClient.expire(`login_failed${ip}`, 120) // set NX  not working 😪

                const ttl = await redisClient.ttl(`login_failed${ip}`)
                console.log(ttl)

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
            console.log(error)
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
=======
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
>>>>>>> a30e69258abb7728fc1e981be9420856fb279489
