const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const logger = require('../../config/logger')
const { Op } = require('sequelize')

const User = require('../user/model')
const Role = require('../model/role')
const menuController = require('../menu/controller')

// const delay = (t, val) => {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       resolve(val)
//     }, t)
//   })
// }

exports.login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const userValid = await User.findOne({
      where: { email, state: 1 }
    })
    if (!userValid) {
      return res.status(403).json({
        ok: false,
        msg: 'Usuario/Contraseña incorrecta.'
      })
    }

    const validatePassword = await bcryptjs.compare(
      password,
      userValid.password
    )
    if (!validatePassword) {
      return res.status(403).json({
        ok: false,
        msg: 'Usuario/Contraseña incorrecta.'
      })
    }

    const token = jwt.sign({ idUser: userValid.id }, process.env.JWT, {
      expiresIn: '24h'
    })

    const { menus, routes } = await menuController.listMenu(userValid.roleId)

    const user = await User.findOne({
      where: { email, state: 1 },
      attributes: ['id', 'name', 'email', 'state', 'created', 'updated'],
      include: {
        model: Role
      }
    })

    return res.status(200).json({
      ok: true,
      msg: 'Usuario y contraseña correctos',
      token,
      user,
      menus,
      routes
    })
  } catch (err) {
    logger.log('error', `user/login ${err}`)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}

exports.renewToken = async (req, res, next) => {
  try {
    const idUser = req.idUser
    const token = jwt.sign({ idUser }, process.env.JWT, {
      expiresIn: '24h'
    })
    const userValid = await User.findOne({
      where: {
        state: 1,
        id: idUser
      }
    })

    const { menus, routes } = await menuController.listMenu(userValid.roleId)

    const user = await User.findOne({
      where: { id: idUser, state: 1 },
      attributes: ['id', 'name', 'email', 'state', 'created', 'updated'],
      include: {
        model: Role
      }
    })

    res.status(200).json({
      ok: true,
      msg: 'Token actualizado',
      token,
      user,
      menus,
      routes
    })
  } catch (err) {
    logger.log('error', `user/renewToken ${err}`)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}

exports.user = async (req, res, next) => {
  try {
    const idUser = req.idUser
    const user = await User.findOne({
      attributes: ['id', 'name', 'email', 'state', 'created', 'updated'],
      where: {
        id: idUser,
        state: 1
      },
      include: {
        model: Role
      }
    })
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'El usuario no existe.'
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'Información de usuario',
      user
    })
  } catch (err) {
    logger.log('error', `user/user ${err}`)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}

exports.update = async (req, res, next) => {
  const idUser = req.idUser
  const { email, name } = req.body

  try {
    const existsUser = await User.findOne({
      where: {
        id: idUser
      }
    })
    if (!existsUser) {
      return res.status(500).json({
        ok: false,
        msg: 'No existe usuario.'
      })
    }

    const validateEmail = await User.findOne({
      where: {
        email,
        id: {
          [Op.not]: idUser
        }
      }
    })
    // VALIDAMOS QUE EL CORREO NUEVO SEA UNICO
    if (validateEmail) {
      return res.status(500).json({
        ok: false,
        msg: 'El correo ya esta registrado.'
      })
    }

    await User.update(
      { name, email },
      {
        where: {
          id: idUser
        }
      }
    )
    const userUpdate = await User.findByPk(idUser, {
      attributes: ['id', 'name', 'email', 'state', 'created', 'updated'],
      include: [
        {
          model: Role
        }
      ]
    })

    return res.status(200).json({
      ok: true,
      msg: 'El usuario fue actualizado.',
      user: userUpdate
    })
  } catch (err) {
    logger.log('error', `user/update ${err}`)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
