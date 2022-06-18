const express = require('express')
const UserController = require('../controllers/UserController')
const authMiddleWare = require('../middlewares/authMidleware')
const { validateUser } = require('../middlewares/validators/user-validator')
const { Router } = express

const userRouter = Router()

userRouter.post('/register', validateUser, UserController.createUser)
userRouter.post('/login', validateUser, UserController.logInUser)
userRouter.post('/logout', authMiddleWare, UserController.logoutUser)
userRouter.get('/profile', authMiddleWare, UserController.getUserInfo)
userRouter.get('/shop', authMiddleWare, UserController.getUserShop)

module.exports = userRouter
