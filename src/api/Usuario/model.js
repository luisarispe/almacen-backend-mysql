const { DataTypes } = require('sequelize')
const { db } = require('../../database/config')
const perfil = require('../model/perfil')
const Usuario = db.define('usuario', {
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
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Cuando el valor es 1 esta activo y si es 0 inactivo'
  }

})

const usuariosPerfiles = db.define('usuarios_perfiles', {}, { timestamps: false })

perfil.belongsToMany(Usuario, {
  through: usuariosPerfiles,
  foreignKey: 'id_perfil',
  otherKey: 'id_usuario',
  as: 'usuarios'
})

Usuario.belongsToMany(perfil, {
  through: usuariosPerfiles,
  foreignKey: 'id_usuario',
  otherKey: 'id_perfil',
  as: 'perfiles'
})

// Usuarios.sync({
//   alter: true
// }).then(() => {
//   console.log(1)
// }).catch(error => {
//   console.log(error)
// })

module.exports = Usuario
