const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuarios = require('./model')

exports.agregarUsuario = async (req, res, next) => {
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
