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

})

const UsersRoles = db.define('users_roles', {}, { timestamps: false })

Role.belongsToMany(User, {
  through: UsersRoles,
  as: 'users'
})

User.belongsToMany(Role, {
  through: UsersRoles,
  as: 'roles'
})

// Role.sync({
//   alter: true
// }).then(() => {
//   console.log(1)
// }).catch(error => {
//   console.log(error)
// })

// User.sync({
//   alter: true
// }).then(() => {
//   console.log(1)
// }).catch(error => {
//   console.log(error)
// })
// UsersRoles.sync({})

module.exports = User
