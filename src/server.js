require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./db/db')
const configRouter = require('./routes/routes')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,POST,DELETE,PUT,PATCH',
        credentials: true,
    })
)

const PORT = process.env.PORT || 3001

// connect db
connectDB()
//config router
configRouter(app)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
