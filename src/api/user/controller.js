const bcryptjs = require('bcryptjs')
const { Op } = require('sequelize')
const logger = require('../../config/logger')

const User = require('./model')
const Role = require('../model/role')
// const delay = (t, val) => {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       resolve(val)
//     }, t)
//   })
// }

exports.create = async (req, res, next) => {
  const { email, password, name } = req.body
  try {
    const existsEmail = await User.findOne({
      where: {
        email
      }
    })
    if (existsEmail) {
      return res.status(500).json({
        ok: false,
        msg: 'El correo ya esta registrado.'
      })
    }

    const salt = bcryptjs.genSaltSync()

    const userCreate = await User.create({
      name,
      email,
      password: bcryptjs.hashSync(password, salt)
    })

    return res.status(200).json({
      ok: true,
      msg: 'Usuario creado.',
      user: userCreate
    })
  } catch (err) {
    logger.log('error', `user/create ${err}`)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}
exports.update = async (req, res, next) => {
  const { id } = req.params
  const { email, name } = req.body

  try {
    const existsUser = await User.findOne({
      where: {
        id
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
          [Op.not]: id
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
          id
        }
      }
    )
    const userUpdate = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: {
            attributes: []
          }
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
exports.updateState = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findByPk(id)

    // VALIDAMOS SI EXISTE EL USUARIO
    if (!user) {
      return res.status(500).json({
        ok: false,
        msg: 'No existe usuario.'
      })
    }
    const state = user.state === 0 ? 1 : 0

    await User.update(
      { state },
      {
        where: {
          id
        }
      })
    return res.status(200).json({
      ok: true,
      msg: 'Estado actualizado.'
    })
  } catch (err) {
    logger.log('error', `user/updateState ${err}`)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}

exports.list = async (req, res, next) => {
  const from = Number(req.query.desde) || 0
  try {
    const users = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'state', 'created', 'updated'],
      order: [
        ['created', 'DESC']
      ],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ],
      distinct: true,
      offset: from,
      limit: 5
    })

    res.status(200).json({
      ok: true,
      users: users.rows,
      total: users.count
    })
  } catch (err) {
    logger.log('error', `user/list ${err}`)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}
