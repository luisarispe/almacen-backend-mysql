const logger = require('../../config/logger')
const Role = require('../model/role')
const Menu = require('./model')
const SubMenu = require('../model/subMenu')
const TypeMenu = require('../model/typeMenu')

const listMenu = async (idRole) => {
  try {
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
          where: { id: idRole }
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

    const routes = filterRoutes(menusArray)

    return {
      menus: menusArray,
      routes
    }
  } catch (err) {
    logger.log('error', `menu/listMenu ${err}`)
    return {
      menus: [],
      routes: []
    }
  }
}
module.exports = {
  listMenu
}
// exports.listMenu = async (req, res, next) => {
//   try {
//     const idUser = req.idUser
//     const user = await User.findOne({
//       where: {
//         id: idUser,
//         state: true
//       }
//     })
//     const menus = await Menu.findAll({
//       where: { state: true },
//       attributes: ['id', 'title', 'icon', 'link'],
//       include: [
//         {
//           model: Role,
//           as: 'roles',
//           through: {
//             attributes: []
//           },
//           where: { id: user.roleId }
//         },
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
//       ],
//       order: [['order']]
//     })

//     const menusArray = JSON.parse(JSON.stringify(menus))
//     menusArray.map(menu => {
//       menu.type = menu.typemenu.type
//       delete menu.typemenu
//       delete menu.roles
//       return menu
//     })

//     const routes = filterRoutes(menusArray)

//     return res.status(200).json(
//       {
//         ok: true,
//         msg: 'Lista de menus.',
//         menus: menusArray,
//         routes
//       }
//     )
//   } catch (err) {
//     logger.log('error', `menu/listMenu ${err}`)
//     return res.status(500).json({
//       ok: false,
//       msg: 'Hable con el administrador.'
//     })
//   }
// }

const filterRoutes = (menus) => {
  const routes = []
  try {
    menus.forEach(menu => {
      if (menu.link !== '') routes.push(menu.link)

      if (menu.children) {
        menu.children.forEach(subMenu => {
          if (subMenu.link !== '') routes.push(subMenu.link)
        })
      }
    })
    return routes
  } catch (error) {
    return []
  }
}
