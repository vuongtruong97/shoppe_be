const userRouter = require('./user.route')
const oauthRouter = require('./oauth.route')
const categoryRouter = require('./category.route')
const shopRouter = require('./shop.route')
const prodRouter = require('./product.route')
const imageRouter = require('./image.route')
const permRouter = require('./permission.route')
const roleRouter = require('./role.route')
const cartRouter = require('./cart.route')

const authMiddleWare = require('../middlewares/authMidleware')

const configRouter = (app) => {
    app.use('/images', imageRouter)
    app.use('/products', prodRouter)
    app.use('/categories', categoryRouter)
    app.use('/oauth', oauthRouter)
    app.use('/users', userRouter)
    app.use('/shops', shopRouter)
    app.use('/permissions', permRouter)
    app.use('/roles', roleRouter)
    app.use('/carts', authMiddleWare, cartRouter)
    app.use('*', (req, res) => res.send('shobee_by_vuong_truong'))
}

module.exports = configRouter
