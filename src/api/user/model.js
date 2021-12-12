const { DataTypes } = require('sequelize')
const { db } = require('../../config/database')
const Role = require('../model/role')
const User = db.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    set (val) {
      this.setDataValue('name', val.toLowerCase())
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    isEmail: true,
    set (val) {
      this.setDataValue('email', val.toLowerCase())
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'When the value is 1 it is active and if it is 0 inactive'
  }

}, {
  updatedAt: 'updated',
  createdAt: 'created'
})

User.belongsTo(Role,
  {
    foreignKey: {
      defaultValue: 1
    }
  })

// Role.sync({
//   alter: true
// }).then(() => {
//   console.log(1)
// }).catch(error => {
//   console.log(error)
// })

// User.sync({
// }).then(() => {
//   console.log(1)
// }).catch(error => {
//   console.log(error)
// })
// UsersRoles.sync({})
// Menu.sync({
//   alter: true
// })
// SubMenu.sync({
//   alter: true
// })
module.exports = User
