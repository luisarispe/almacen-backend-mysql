const { DataTypes } = require('sequelize')
const { db } = require('../../database/config')

const Role = db.define('role', {
  name: {
    type: DataTypes.STRING(100)
  }
}, { timestamps: false }
)

module.exports = Role
