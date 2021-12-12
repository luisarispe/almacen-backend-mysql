const jwt = require('jsonwebtoken')
const User = require('../api/user/model')

const validateJWT = async (req, res, next) => {
  // await delay(5000)
  const token = req.header('x-token')
  if (!token) {
    // STATUS 401 NO AUTORIZADO
    return res.status(400).json({
      ok: false,
      msg: 'No hay token en la petición'
    })
  }
  try {
    const { idUser } = jwt.verify(token, process.env.JWT)
    const user = await User.findOne({
      where: {
        id: idUser,
        state: 1
      }
    })

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: 'Usuario no autorizado.'
      })
    }
    req.idUser = idUser

    next()
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido'
    })
  }
}

module.exports = validateJWT
