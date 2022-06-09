require('dotenv').config()
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')

const { SECRET_KEY } = process.env

const connectDB = require('./db/db')
const configRouter = require('./routes/routes')

const app = express()

app.use(
    session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 3001

// connect db
connectDB()
//config router
configRouter(app)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
