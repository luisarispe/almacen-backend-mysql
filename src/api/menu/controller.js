const logger = require('../../config/logger')

const Role = require('../model/role')
const Menu = require('./model')
const SubMenu = require('../model/subMenu')
const TypeMenu = require('../model/typeMenu')

exports.listMenu = async (idRole) => {
  try {
    const menusRoles = await Role.findOne({
      where: { id: idRole },
      include: [
        {
          model: Menu,
          as: 'menus',
          attributes: ['id', 'title', 'icon', 'link'],
          through: {
            attributes: []
          },
          where: { state: true },
          include: [
            { model: SubMenu, required: false, as: 'children', where: { state: true } },
            {
              model: TypeMenu,
              required: true,
              attributes: ['type']
            }
          ]
        }
      ]
    })

    const menus = menusRoles.menus
    return menus
  } catch (err) {
    logger.log('error', `user/login ${err}`)
    return []
  }
}
