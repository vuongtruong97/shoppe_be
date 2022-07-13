const express = require('express')
const AuthController = require('../controllers/OAuthController')

const { Router } = express
const oauthRouter = Router()

oauthRouter.post('/google', AuthController.authenticateUser)

module.exports = oauthRouter
