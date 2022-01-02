const logger = require('../../config/logger')
const Role = require('../model/role')
const Menu = require('./model')
const SubMenu = require('../model/subMenu')
const TypeMenu = require('../model/typeMenu')
const User = require('../user/model')

exports.listMenu = async (req, res, next) => {
  try {
    const idUser = req.idUser
    const user = await User.findOne({
      where: {
        id: idUser,
        state: true
      }
    })
    // const menusRoles = await Role.findOne({
    //   where: { id: user.roleId },
    //   include: [
    //     {
    //       model: Menu,
    //       as: 'menus',
    //       attributes: ['id', 'title', 'icon', 'link', 'order'],
    //       through: {
    //         attributes: []
    //       },
    //       where: { state: true },
    //       include: [
    //         {
    //           model: SubMenu,
    //           required: false,
    //           as: 'children',
    //           where: { state: true }
    //         },
    //         {
    //           model: TypeMenu,
    //           required: true,
    //           attributes: ['type']
    //         }
    //       ]
    //     }
    //   ]
    // })

    const menus = await Menu.findAll({
      where: { state: true },
      attributes: ['id', 'title', 'icon', 'link'],
      include: [
        {
          model: Role,
          as: 'roles',
          through: {
            attributes: []
          },
          where: { id: user.roleId }
        },
        {
          model: SubMenu,
          required: false,
          as: 'children',
          where: { state: true }
        },
        {
          model: TypeMenu,
          required: true,
          attributes: ['type']
        }
      ],
      order: [['order']]
    })

    const menusArray = JSON.parse(JSON.stringify(menus))
    menusArray.map(menu => {
      menu.type = menu.typemenu.type
      delete menu.typemenu
      delete menu.roles
      return menu
    })

    return res.status(200).json(
      {
        ok: true,
        msg: 'Lista de menus.',
        menus: menusArray
      }
    )
  } catch (err) {
    logger.log('error', `menu/listMenu ${err}`)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}
