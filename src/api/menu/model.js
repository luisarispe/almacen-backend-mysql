const { DataTypes } = require('sequelize')
const { db } = require('../../config/database')
const SubMenu = require('../model/subMenu')
const Role = require('../model/role')
const TypeMenu = require('../model/typeMenu')

const Menu = db.define('menu', {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  link: {
    type: DataTypes.STRING(100)
  },
  state: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'When the value is 1 it is active and if it is 0 inactive'
  }
},
{ timestamps: false }

)

Menu.hasMany(SubMenu, {
  as: 'children'
})

Menu.belongsTo(TypeMenu)

const MenusRoles = db.define('menusRoles', {}, { timestamps: false })

Menu.belongsToMany(Role, {
  through: MenusRoles,
  as: 'roles'
})

Role.belongsToMany(Menu, {
  through: MenusRoles,
  as: 'menus'
})

module.exports = Menu
