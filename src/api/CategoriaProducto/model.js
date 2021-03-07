const { DataTypes } = require('sequelize')
const { db } = require('../../database/config')
const Usuarios = require('../Usuario/model')

const CategoriasProductos = db.define('categorias_productos', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    trim: true
  },
  estado: {
    type: DataTypes.INTEGER(1),
    defaultValue: 1,
    comment: 'Cuando el valor es 1 esta activo y si es 0 inactivo'
  }
})

CategoriasProductos.belongsTo(Usuarios, {
  foreignKey: {
    name: 'id_usuario'
  }
})

module.exports = CategoriasProductos
