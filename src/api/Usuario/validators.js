const { check } = require('express-validator')
const { validarCampos, validaIgualCampos } = require('../../middlewares/validarCampos')
const agregar = [
  check('nombre', 'El nombre es obligatorio.').not().isEmpty().trim(),
  check('nombre', 'El nombre solo puede tener letras (a-z) y su máximo de caracteres es de 100.').matches(/^[a-zA-ZÀ-ÿ\s]{1,100}$/),
  check('correo', 'El correo es obligatorio.').not().isEmpty(),
  check('correo', 'El correo no es valido.').isEmail().trim(),
  check('contrasena', 'La contraseña es obligatoria.').not().isEmpty().trim(),
  validarCampos
]

const actualizar = [
  check('nombre', 'El nombre es obligatorio.').not().isEmpty().trim(),
  check('nombre', 'El nombre solo puede tener letras (a-z) y su máximo de caracteres es de 100.').matches(/^[a-zA-ZÀ-ÿ\s]{1,100}$/),
  check('correo', 'El correo es obligatorio.').not().isEmpty(),
  check('correo', 'El correo no es valido.').isEmail().trim(),
  validarCampos
]

const login = [
  check('correo', 'Ingrese un correo valido.').isEmail(),
  check('contrasena', 'La contraseña es obligatoria.').not().isEmpty(),
  validarCampos
]

const enviarContrasenaTemporal = [
  check('correo', 'Ingrese un correo valido.').isEmail(),
  validarCampos
]

const cambiarContrasena = [
  check('contrasena', 'Ingrese una contraseña.').not().isEmpty().trim(),
  check('contrasenaNueva', 'Ingrese una nueva contrasenña.').not().isEmpty().trim(),
  check('contrasenaConfirma', 'Ingrese una nueva contraseña.').not().isEmpty().trim(),
  check('contrasenaConfirma', 'La confirmación de la contraseña no coincide con la contraseña.').custom((value, { req }) => validaIgualCampos(value, req.body.contrasenaNueva)),
  validarCampos
]

module.exports = {
  agregar,
  actualizar,
  login,
  enviarContrasenaTemporal,
  cambiarContrasena
}
