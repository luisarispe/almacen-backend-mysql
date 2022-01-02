const { DataTypes } = require('sequelize')
const { db } = require('../../config/database')

const SubMenu = db.define('submenu', {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.VIRTUAL,
    get () {
      return 'basic'
    }
  },
  icon: {
    type: DataTypes.STRING(100)
  },
  link: {
    type: DataTypes.STRING(100),
    allowNull: false
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

module.exports = SubMenu
