const { DataTypes } = require('sequelize')
const { db } = require('../../database/config')

const Perfil = db.define('perfil', {
  nombre: {
    type: DataTypes.STRING(100)
  }
}, { timestamps: false }
)

module.exports = Perfil
