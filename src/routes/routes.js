const userRouter = require('./user.route')

const configRouter = (app) => {
    app.use('/users', userRouter)
    app.use('*', (req, res) => res.send('shopee_be_by_vuong_truong'))
}

module.exports = configRouter
