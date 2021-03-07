const { DataTypes } = require('sequelize')
const { db } = require('../../database/config')
const Usuarios = require('../Usuario/model')
const CategoriasProductos = require('../CategoriaProducto/model')

const Productos = db.define('productos', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    trim: true
  },
  cantidad: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
    defaultValue: 0
  },
  precio: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
    defaultValue: 0
  },
  estado: {
    type: DataTypes.INTEGER(1),
    defaultValue: 1,
    comment: 'Cuando el valor es 1 esta activo y si es 0 inactivo'
  }
})

Productos.belongsTo(CategoriasProductos, {
  foreignKey: {
    name: 'id_categoria'
  }
})

Productos.belongsTo(Usuarios, {
  foreignKey: {
    name: 'id_usuario'
  }
})

// Productos.sync({});
module.exports = Productos
