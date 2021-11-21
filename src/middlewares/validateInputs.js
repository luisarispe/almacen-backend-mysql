const { validationResult } = require('express-validator')

const validateInputs = (req, res, next) => {
  try {
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
      const erroresMap = errores.errors
      const msgs = erroresMap.map((error, index, array) => {
        return error.msg
      })

      return res.status(500).json({
        ok: false,
        msg: msgs[0]
      })
    }
    next()
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador.'
    })
  }
}

const validateNoCharactersEsp = (value) => {
  // SE VALIDA QUE SOLO SE PUEDE INGRESAR LETRAS
  if (/^[a-zA-ZÀ-ÿ\s]{1,100}$/.test(value)) {
    return true
  } else {
    return false
  }
}
const validateEqualInputs = (input1, input2) => {
  // SE VALIDA QUE LOS 2 CAMPOS SEAN IGUALES
  if (input1 !== input2) {
    return false
  } else {
    return true
  }
}

module.exports = {
  validateInputs,
  validateNoCharactersEsp,
  validateEqualInputs
}
