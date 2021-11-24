const { DataTypes } = require('sequelize')
const { db } = require('../../config/database')

const Role = db.define('role', {
  name: {
    type: DataTypes.STRING(100)
  }
}, { timestamps: false }
)

module.exports = Role
