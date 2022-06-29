const userRouter = require('./user.route')
const oauthRouter = require('./oauth.route')
const categoryRouter = require('./category.route')
const shopRouter = require('./shop.route')
const prodRouter = require('./product.route')
const imageRouter = require('./image.route')
const permRouter = require('./permission.route')

const configRouter = (app) => {
    app.use('/images', imageRouter)
    app.use('/products', prodRouter)
    app.use('/categories', categoryRouter)
    app.use('/oauth', oauthRouter)
    app.use('/users', userRouter)
    app.use('/shops', shopRouter)
    app.use('/perms', permRouter)
    app.use('*', (req, res) => res.send('shobee_by_vuong_truong'))
}

module.exports = configRouter
