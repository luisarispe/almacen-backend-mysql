const path = require('path')

const confingSwagger = (ruta) => {
  const swaggerSpec = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Sistema Almacen',
        description: 'Sistema de stock de un almacen',
        version: '1.0.0'
      },
      servers: [{
        url: 'http://localhost:3000'
      }]
    },
    apis: [
            `${path.join(ruta, 'api/user/documentation.js')}`
    ]
  }
  return swaggerSpec
}

module.exports = confingSwagger
