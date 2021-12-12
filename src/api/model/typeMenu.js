const { DataTypes } = require('sequelize')
const { db } = require('../../config/database')

const TypeMenu = db.define('typemenu', {
  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, { timestamps: false })

module.exports = TypeMenu
