const { DataTypes } = require('sequelize')
const { db } = require('../../database/config')

const Usuarios = db.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100)
  },
  correo: {
    type: DataTypes.STRING(100),
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING(100)
  },
  estado: {
    type: DataTypes.INTEGER(1),
    defaultValue: 1,
    comment: 'Cuando el valor es 1 esta activo y si es 0 inactivo'
  }
})

module.exports = Usuarios
