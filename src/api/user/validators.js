const { check } = require('express-validator')
const { validateInputs } = require('../../helpers/validateInputs')
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

module.exports = {
  create,
  update
}
