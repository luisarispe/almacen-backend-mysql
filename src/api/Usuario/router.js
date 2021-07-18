const { Router } = require('express')
const usuarioController = require('./controller')
const { validarCampos, validaSinCaracteresEsp } = require('../../middlewares/validarCampos')
const { check } = require('express-validator')
const router = Router()
const validaJWT = require('../../middlewares/validaJwt')

router.post(
  '/agregar',
  [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty().trim(),
    check('nombre', 'El nombre no puede tener caracteres especiales.').custom(value => validaSinCaracteresEsp(value)),
    check('correo', 'El correo es obligatorio.').not().isEmpty(),
    check('correo', 'El correo no es valido.').isEmail().trim(),
    check('contrasena', 'La contraseña es obligatoria.').not().isEmpty().trim(),
    validarCampos
  ],
  usuarioController.agregar
)
router.put(
  '/actualizar/:id',
  [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty().trim(),
    check('nombre', 'El nombre no puede tener caracteres especiales.').custom(value => validaSinCaracteresEsp(value)),
    check('correo', 'El correo es obligatorio.').not().isEmpty(),
    check('correo', 'El correo no es valido.').isEmail().trim(),
    validarCampos
  ],
  validaJWT,
  usuarioController.actualizar
)
router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio.').isEmail(),
    check('contrasena', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos
  ],
  usuarioController.login
)
router.get(
  '/listar',
  validaJWT,
  usuarioController.listar
)
router.get(
  '/actualizarEstado/:id',
  validaJWT,
  usuarioController.actualizarEstado
)

router.get('/traerUsuario/:id',
  validaJWT,
  usuarioController.traerUsuario
)

router.get('/renewToken', validaJWT, usuarioController.renewToken)
module.exports = router
