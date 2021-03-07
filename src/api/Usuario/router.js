const { Router } = require('express')
const usuarioController = require('./controller')
const validarCampos = require('../../middlewares/validarCampos')
const { check } = require('express-validator')
const router = Router()
const validaJWT = require('../../middlewares/validaJwt')
router.post(
  '/agregar',
  [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('correo', 'El correo es obligatorio.').isEmail(),
    check('contrasena', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos
  ],
  usuarioController.agregarUsuario
)
router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
  ],
  usuarioController.login
)

router.get('/renewToken', validaJWT, usuarioController.renewToken)
module.exports = router
