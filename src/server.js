require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const { connectDB, connectRedis } = require('./db/db')
const configRouter = require('./routes/routes')
const errorHandler = require('./middlewares/errorMiddleware/errorHandler')
const logger = require('./lib/logger.lib')
const httpLogger = require('./lib/httpLogger')

const app = express()

const PORT = process.env.PORT || 3001

app.use(httpLogger)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cors config
app.use(
    cors({
        origin: ['https://shopee-react-f72ae.web.app', 'http://localhost:3000'],
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
