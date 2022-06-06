const userRouter = require('./user.route')

const configRouter = (app) => {
    app.use('*', (req, res) => res.send('shopee_be_by_vuong_truong'))
    app.use('/users', userRouter)
}

module.exports = configRouter
