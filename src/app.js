const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morganBody = require('morgan-body')
const loggerStream = require('./helpers/sendLogger')

const router = require('./routes')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerConfig = require('./config/swagger')

// app express
const app = express()

// para ver las rutas
morganBody(app, {
  noColors: true,
  stream: loggerStream,
  skip: function (req, res) {
    return res.statusCode < 400
  }
})

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
