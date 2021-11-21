const { check } = require('express-validator')
const { validateInputs, validateEqualInputs } = require('../../middlewares/validateInputs')
const create = [
  check('name', 'El nombre es obligatorio.').not().isEmpty().trim(),
  check('name', 'El nombre solo puede tener letras (a-z) y su máximo de caracteres es de 100.').matches(/^[a-zA-ZÀ-ÿ\s]{1,100}$/),
  check('email', 'El correo es obligatorio.').not().isEmpty(),
  check('email', 'El correo no es valido.').isEmail().trim(),
  check('password', 'La contraseña es obligatoria.').not().isEmpty().trim(),
  validateInputs
]

const update = [
  check('name', 'El nombre es obligatorio.').not().isEmpty().trim(),
  check('name', 'El nombre solo puede tener letras (a-z) y su máximo de caracteres es de 100.').matches(/^[a-zA-ZÀ-ÿ\s]{1,100}$/),
  check('email', 'El correo es obligatorio.').not().isEmpty(),
  check('email', 'El correo no es valido.').isEmail().trim(),
  validateInputs
]

const login = [
  check('email', 'Ingrese un correo valido.').isEmail(),
  check('password', 'La contraseña es obligatoria.').not().isEmpty(),
  validateInputs
]

const sendTempPassword = [
  check('email', 'Ingrese un correo valido.').isEmail(),
  validateInputs
]

const changePassword = [
  check('password', 'Ingrese una contraseña.').not().isEmpty().trim(),
  check('passwordNew', 'Ingrese una nueva contrasenña.').not().isEmpty().trim(),
  check('passwordConfirm', 'Ingrese una nueva contraseña.').not().isEmpty().trim(),
  check('passwordConfirm', 'La confirmación de la contraseña no coincide con la contraseña.').custom((value, { req }) => validateEqualInputs(value, req.body.passwordNew)),
  validateInputs
]

module.exports = {
  create,
  update,
  login,
  sendTempPassword,
  changePassword
}
