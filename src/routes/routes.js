const userRouter = require('./user.route')

const configRouter = (app) => {
    app.use('/users', userRouter)
}

module.exports = configRouter
