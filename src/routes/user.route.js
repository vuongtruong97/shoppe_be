const express = require('express')
const UserController = require('../controllers/UserController')

const { Router } = express

const userRouter = Router()

userRouter.get('/login', (req, res) => {
    res.send('login page')
})

userRouter.post('/register', UserController.createUser)

module.exports = userRouter
