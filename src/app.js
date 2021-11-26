const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const router = require('./routes')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerConfig = require('./config/swagger')

// app express
const app = express()

// para ver las rutas
app.use(morgan('dev'))

app.use(cors())

// Lectura y parseo del body
app.use(express.json())

// Rutas
app.use('/api', router)
// Documentación
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(
  swaggerJsDoc(
    swaggerConfig(__dirname)
  )
))

app.set('port', process.env.PORT_SERVER || 4000)

module.exports = app
