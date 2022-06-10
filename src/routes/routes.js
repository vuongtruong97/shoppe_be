const userRouter = require('./user.route')
const oauthRouter = require('./oauth.route')
const categoryRouter = require('./category.route')

const configRouter = (app) => {
    app.use('/categories', categoryRouter)
    app.use('/oauth', oauthRouter)
    app.use('/users', userRouter)
    app.use('*', (req, res) => res.send('shopee_be_by_vuong_truong'))
}

module.exports = configRouter
