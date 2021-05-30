const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuarios = require('./model')
const { Op } = require('sequelize')

exports.agregar = async (req, res, next) => {
  const { correo, contrasena, nombre } = req.body
  try {
    const existeCorreo = await Usuarios.findOne({
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
    const usuario = Usuarios.build({ nombre, correo })

    const salt = bcryptjs.genSaltSync()
    usuario.contrasena = bcryptjs.hashSync(contrasena, salt)

    await usuario.save()

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
    const usuario = await Usuarios.findOne({
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

    const validaCorreo = await Usuarios.findOne({
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

    await Usuarios.update(
      { nombre, correo },
      {
        where: {
          id
        }
      }
    )

    return res.status(200).json({
      ok: true,
      mensaje: 'El usuario fue actualizado.'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}

exports.login = async (req, res, next) => {
  const { correo, contrasena } = req.body

  try {
    const usuario = await Usuarios.findOne({
      where: {
        correo,
        estado: 1
      }
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
    const usuarios = await Usuarios.findAndCountAll({
      attributes: ['id', 'nombre', 'correo', 'estado', 'createdAt', 'updatedAt'],
      order: [
        ['createdAt', 'DESC']
      ],
      offset: desde,
      limit: 5
    })

    res.status(200).json({
      ok: true,
      usuarios
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
    const usuario = await Usuarios.findOne({
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
