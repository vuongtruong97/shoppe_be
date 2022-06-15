const express = require('express')
const UserController = require('../controllers/UserController')
const authMiddleWare = require('../middlewares/authMidleware')
const { validateUserRegister } = require('../middlewares/validators/user-validator')
const { Router } = express

const userRouter = Router()

userRouter.post('/register', validateUserRegister, UserController.createUser)
userRouter.post('/login', validateUserRegister, UserController.logInUser)
userRouter.post('/logout', authMiddleWare, UserController.logoutUser)

module.exports = userRouter
