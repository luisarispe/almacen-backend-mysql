const { DataTypes } = require('sequelize')
const { db } = require('../../database/config')

const Usuarios = db.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    set (val) {
      this.setDataValue('nombre', val.toLowerCase())
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    isEmail: true,
    set (val) {
      this.setDataValue('correo', val.toLowerCase())
    }
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.INTEGER(1),
    defaultValue: 1,
    comment: 'Cuando el valor es 1 esta activo y si es 0 inactivo'
  }

})

// Usuarios.sync({
//   alter: true
// }).then(() => {
//   console.log(1)
// }).catch(error => {
//   console.log(error)
// })
module.exports = Usuarios
