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

const validaSinCaracteresEsp = (value) => {
  // SE VALIDA QUE SOLO SE PUEDE INGRESAR LETRAS
  if (/^[a-zA-ZÀ-ÿ\s]{1,100}$/.test(value)) {
    return true
  } else {
    return false
  }
}
const validaIgualCampos = (campo1, campo2) => {
  // SE VALIDA QUE LOS 2 CAMPOS SEAN IGUALES
  if (campo1 !== campo2) {
    return false
  } else {
    return true
  }
}

module.exports = {
  validarCampos,
  validaSinCaracteresEsp,
  validaIgualCampos
}
