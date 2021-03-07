const { validationResult } = require('express-validator')

const validarCampos = (req, res, next) => {
  try {
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
      const erroresMap = errores.errors
      const msgs = erroresMap.map((error, index, array) => {
        return error.msg
      })

      return res.status(500).json({
        ok: false,
        mensaje: msgs[0]
      })
    }
    next()
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Hable con el administrador.'
    })
  }
}
module.exports = validarCampos
