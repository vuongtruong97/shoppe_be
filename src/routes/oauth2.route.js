require('../lib/passport')
const express = require('express')
const passport = require('passport')

const oauthRouter = express.Router()

// Google Login
oauthRouter.get('/google', passport.authenticate('google'))

oauthRouter.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/oauth/failure' }), (req, res) => {
    return res.redirect('/oauth/success')
})

// Facebook login
oauthRouter.get('/facebook', passport.authenticate('facebook'))

oauthRouter.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: '/oauth/failure' }), (req, res) => {
    return res.redirect('/oauth/success')
})

//
oauthRouter.get('/success', (req, res) => {
    console.log(req.user)
    return res.status(200).json({ success: true, token: req.user.token })
})

oauthRouter.get('/failure', (req, res) => {
    return res.status(201).json({ success: 'false', message: 'Login failure, please try later' })
})

module.exports = oauthRouter
