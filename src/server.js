<<<<<<< HEAD
require('dotenv').config()
require('./lib/cloudFlare-update-dns-ip')
const https = require('https')
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const { connectDB } = require('./db/db')
const { connectRedis } = require('./db/redis')
const configRouter = require('./routes/routes')
const errorHandler = require('./middlewares/errorMiddleware/errorHandler')
const logger = require('./lib/logger.lib')
const httpLogger = require('./lib/httpLogger')

const app = express()

const PORT = process.env.PORT || 3001

app.enable('trust proxy')
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(compression({ level: 6 }))
app.use(httpLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cors config
app.use(
    cors({
        origin: [
            'https://shopee-react-f72ae.web.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://shobee.ddns.net',
            'https://snobdev.online',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
)

// connect db
connectDB()
connectRedis()

// config router
configRouter(app)

// error handler
app.use(errorHandler)

// bootstrap app
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
})

// keep awake heroku
setInterval(function () {
    https.get(process.env.ROOT_URL)
}, 300000) // every 5 minutes (300000)
=======
require('dotenv').config()
require('./queue/rabbitmq')
const https = require('https')
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const { connectDB } = require('./db/db')
const { connectRedis } = require('./db/redis')
const configRouter = require('./routes/routes')
const errorHandler = require('./middlewares/errorMiddleware/errorHandler')
const logger = require('./lib/logger.lib')
const httpLogger = require('./lib/httpLogger')

const app = express()

const PORT = process.env.PORT || 3001

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(compression({ level: 6 }))
app.use(httpLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cors config
app.use(
    cors({
        origin: [
            'https://shopee-react-f72ae.web.app',
            'http://localhost:3000',
            'http://shobee.ddns.net:1997',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
)

// connect db
connectDB()
connectRedis()

// config router
configRouter(app)

// error handler
app.use(errorHandler)

// bootstrap app
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
})

// keep awake heroku
setInterval(function () {
    https.get(process.env.ROOT_URL)
}, 300000) // every 5 minutes (300000)
>>>>>>> a30e69258abb7728fc1e981be9420856fb279489
