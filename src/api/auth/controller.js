const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const logger = require('../../config/logger')
const { Op } = require('sequelize')

const responseError = require('../../helpers/responseError')
const { sendEmail } = require('../../helpers/sendEmail')

const menuController = require('../menu/controller')

const User = require('../user/model')
const Role = require('../model/role')

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
    if (!userValid) return responseError(res, 'Usuario/Contraseña incorrecta.', 404)

    const validatePassword = await bcryptjs.compare(password, userValid.password)

    if (!validatePassword) return responseError(res, 'Usuario/Contraseña incorrecta.', 401)

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
    console.log(err)
    logger.log('error', `user/login ${err}`)
    responseError(res, 'Hable con el administrador.', 500)
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
    responseError(res, 'Hable con el administrador.', 500)
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
    if (!user) return responseError(res, 'El usuario no existe.', 404)

    return res.status(200).json({
      ok: true,
      msg: 'Información de usuario',
      user
    })
  } catch (err) {
    logger.log('error', `user/user ${err}`)
    responseError(res, 'Hable con el administrador.', 500)
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
    if (!existsUser) return responseError(res, 'No existe usuario.', 404)

    const validateEmail = await User.findOne({
      where: {
        email,
        id: {
          [Op.not]: idUser
        }
      }
    })
    // VALIDAMOS QUE EL CORREO NUEVO SEA UNICO
    if (validateEmail) return responseError(res, 'El correo ya esta registrado.', 409)

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
    responseError(res, 'Hable con el administrador.', 500)
  }
}

exports.sendTempPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const validateEmail = await User.findOne({
      where: {
        state: 1,
        email
      }
    })

    if (!validateEmail) return responseError(res, 'El correo no existe.', 404)

    const newPassword = Math.random().toString(36).slice(-15)
    const salt = bcryptjs.genSaltSync()

    await User.update(
      { password: bcryptjs.hashSync(newPassword, salt) },
      {
        where: {
          id: validateEmail.id
        }
      })
    // DATOS DE ENVÍO DE CORREO
    const subject = 'Recuperar Contraseña'
    const sender = { name: 'EleFactory', email: 'factoryele@gmail.com' }
    const to = [{ name: validateEmail.name, email: validateEmail.email }]
    const cc = [{ name: 'EleFactory', email: 'factoryele@gmail.com' }]
    const replyTo = { name: 'EleFactory', email: 'factoryele@gmail.com' }
    const template = 1
    const params = { contrasena: newPassword }
    const infoEmail = { sender, to, replyTo, params, template, cc, subject }
    await sendEmail(infoEmail)

    res.status(200).json({
      ok: true,
      msg: 'El correo fue enviado.'
    })
  } catch (err) {
    logger.log('error', `user/sendTempPassword ${err}`)
    responseError(res, 'Hable con el administrador.', 500)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    const idUser = req.idUser
    const { password, passwordNew } = req.body

    const user = await User.findOne({
      where: {
        id: idUser,
        state: 1
      }
    })
    const validatePassword = await bcryptjs.compare(
      password,
      user.password
    )

    if (!validatePassword) return responseError(res, 'La contraseña es incorrecta.', 401)

    const salt = bcryptjs.genSaltSync()
    await User.update(
      { password: bcryptjs.hashSync(passwordNew, salt) },
      {
        where: {
          id: idUser
        }
      })

    res.status(200).json({
      ok: true,
      msg: 'La contraseña fue actualizada.'
    })
  } catch (err) {
    logger.log('error', `user/changePassword ${err}`)
    responseError(res, 'Hable con el administrador.', 500)
  }
}
