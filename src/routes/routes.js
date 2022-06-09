const userRouter = require('./user.route')
const oauthRouter = require('./oauth2.route')

const configRouter = (app) => {
    app.use('/oauth', oauthRouter)
    app.use('/users', userRouter)
    app.use('*', (req, res) => res.send('shopee_be_by_vuong_truong'))
}

module.exports = configRouter
