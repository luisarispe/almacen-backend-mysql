const jwt = require('jsonwebtoken')
const Usuarios = require('../api/Usuario/model')

const validarJWT = async (req, res, next) => {
  const token = req.header('x-token')

  if (!token) {
    // STATUS 401 NO AUTORIZADO
    return res.status(401).json({
      ok: false,
      mensaje: 'No hay token en la petición'
    })
  }
  try {
    const { idUsuario } = jwt.verify(token, process.env.JWT)
    console.log(idUsuario)
    const usuario = await Usuarios.findOne({
      where: {
        id: idUsuario,
        estado: 1
      }
    })

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario no autorizado.'
      })
    }
    req.idUsuario = idUsuario

    next()
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token no valido'
    })
  }
}

module.exports = validarJWT
