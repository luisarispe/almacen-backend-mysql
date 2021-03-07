const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const router = require('./routes')
// app express
const app = express()

// para ver las rutas
app.use(morgan('dev'))

app.use(cors())

// Lectura y parseo del body
app.use(express.json())

// rutas
app.use('/api', router)

app.set('port', process.env.PORT_SERVER || 4000)

module.exports = app
