const express = require('express')
const UserController = require('../controllers/UserController')
const authMiddleWare = require('../middlewares/authMidleware')
const { Router } = express

const userRouter = Router()

userRouter.get('/login', (req, res) => {
    res.send('login page')
})

userRouter.post('/register', UserController.createUser)
userRouter.post('/logout', authMiddleWare, UserController.logoutUser)

module.exports = userRouter
