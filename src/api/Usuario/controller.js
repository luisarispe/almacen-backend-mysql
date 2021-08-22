const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('./model')
const { Op } = require('sequelize')
const perfil = require('../model/perfil')
const { enviarCorreo } = require('../../helpers/enviarCorreo')

exports.agregar = async (req, res, next) => {
  const { correo, contrasena, nombre } = req.body
  try {
    const existeCorreo = await Usuario.findOne({
      where: {
        correo
      }
    })
    if (existeCorreo) {
      return res.status(500).json({
        ok: false,
        mensaje: 'El correo ya esta registrado.'
      })
    }

    const salt = bcryptjs.genSaltSync()

    const usuario = await Usuario.create({
      nombre,
      correo,
      contrasena: bcryptjs.hashSync(contrasena, salt)
    })

    // SE AGREGA UN PERFIL AL USUARIO POR DEFECTO
    usuario.addPerfiles(1)

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario creado.'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
exports.actualizar = async (req, res, next) => {
  const { id } = req.params
  const { correo, nombre } = req.body

  try {
    const usuario = await Usuario.findOne({
      where: {
        id
      }
    })
    if (!usuario) {
      return res.status(500).json({
        ok: false,
        mensaje: 'No existe usuario.'
      })
    }

    const validaCorreo = await Usuario.findOne({
      where: {
        correo,
        id: {
          [Op.not]: id
        }
      }
    })
    // VALIDAMOS QUE EL CORREO NUEVO SEA UNICO
    if (validaCorreo) {
      return res.status(500).json({
        ok: false,
        mensaje: 'El correo ya esta registrado.'
      })
    }

    await Usuario.update(
      { nombre, correo },
      {
        where: {
          id
        }
      }
    )
    const UsuarioAct = await Usuario.findByPk(id, {
      include: [
        {
          model: perfil,
          as: 'perfiles',
          attributes: ['id', 'nombre'],
          through: {
            attributes: []
          }
        }
      ]
    })

    return res.status(200).json({
      ok: true,
      mensaje: 'El usuario fue actualizado.',
      usuario: UsuarioAct
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
exports.actualizarEstado = async (req, res, next) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id)

    // VALIDAMOS SI EXISTE EL USUARIO
    if (!usuario) {
      return res.status(500).json({
        ok: false,
        mensaje: 'No existe usuario.'
      })
    }
    const estado = usuario.estado === 0 ? 1 : 0

    await Usuario.update(
      { estado },
      {
        where: {
          id
        }
      })
    return res.status(200).json({
      ok: true,
      mensaje: 'Estado actualizado.'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}

exports.login = async (req, res, next) => {
  const { correo, contrasena } = req.body

  try {
    const usuario = await Usuario.findOne({
      where: {
        correo,
        estado: 1
      },

      include: [
        {
          model: perfil,
          as: 'perfiles',
          attributes: ['id', 'nombre'],
          through: {
            attributes: []
          }
        }
      ]

    })
    if (!usuario) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Usuario/Contraseña incorrecta.'
      })
    }

    const validaContrasena = await bcryptjs.compare(
      contrasena,
      usuario.contrasena
    )
    if (!validaContrasena) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Usuario/Contraseña incorrecta.'
      })
    }

    const token = jwt.sign({ idUsuario: usuario.id }, process.env.JWT, {
      expiresIn: '24h'
    })

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario y contraseña correctos',
      token,
      usuario
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}

exports.listar = async (req, res, next) => {
  const desde = Number(req.query.desde) || 0
  try {
    const usuarios = await Usuario.findAndCountAll({
      attributes: ['id', 'nombre', 'correo', 'estado', 'createdAt', 'updatedAt'],
      order: [
        ['createdAt', 'DESC']
      ],
      include: [
        {
          model: perfil,
          as: 'perfiles',
          attributes: ['id', 'nombre'],
          through: {
            attributes: []
          }
        }
      ],
      distinct: true,
      offset: desde,
      limit: 5
    })

    res.status(200).json({
      ok: true,
      usuarios: usuarios.rows,
      total: usuarios.count
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}

exports.renewToken = async (req, res, next) => {
  try {
    const idUsuario = req.idUsuario
    const token = jwt.sign({ idUsuario }, process.env.JWT, {
      expiresIn: '24h'
    })
    const usuario = await Usuario.findOne({
      include: [
        {
          model: perfil,
          as: 'perfiles',
          attributes: ['id', 'nombre'],
          through: {
            attributes: []
          }
        }
      ],
      where: {
        estado: 1,
        id: idUsuario
      }
    })
    res.status(200).json({
      ok: true,
      mensaje: 'Token refrescado',
      token,
      usuario
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}

exports.traerUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id, {
      include: [
        {
          model: perfil,
          as: 'perfiles',
          attributes: ['id', 'nombre'],
          through: {
            attributes: []
          }
        }
      ]
    })

    if (!usuario) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Usuario no encontrado.'
      })
    }
    res.status(200).json({
      ok: true,
      usuario
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
exports.recuperarContrasena = async (req, res, next) => {
  const { correo } = req.body
  try {
    const validaCorreo = await Usuario.findOne({
      where: {
        estado: 1,
        correo
      }
    })

    if (!validaCorreo) {
      return res.status(500).json({
        ok: false,
        mensaje: 'El correo no existe.'
      })
    }

    const asunto = 'Recuperar Contraseña'
    const de = { name: 'EleFactory', email: 'factoryele@gmail.com' }
    const para = [{ name: 'Luis Arispe', email: 'luis.arispe1991@gmail.com' }]
    const cc = [{ name: 'EleFactory', email: 'factoryele@gmail.com' }]
    const responder = { name: 'EleFactory', email: 'factoryele@gmail.com' }
    const template = 1
    const parametros = { parameter: 'My param value', subject: 'New Subject' }
    const datosCorreo = { de, para, responder, parametros, template, cc, asunto }
    await enviarCorreo(datosCorreo)

    res.status(200).json({
      ok: true,
      mensaje: 'El correo fue enviado.'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
