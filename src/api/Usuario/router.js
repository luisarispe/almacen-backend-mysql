const { Router } = require('express')
const usuarioController = require('./controller')
const { validarCampos, validaIgualCampos } = require('../../middlewares/validarCampos')
const { check } = require('express-validator')
const router = Router()
const validaJWT = require('../../middlewares/validaJwt')

router.post(
  '/agregar',
  [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty().trim(),
    check('nombre', 'El nombre solo puede tener letras (a-z) y su máximo de caracteres es de 100.').matches(/^[a-zA-ZÀ-ÿ\s]{1,100}$/),
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
    check('nombre', 'El nombre solo puede tener letras (a-z) y su máximo de caracteres es de 100.').matches(/^[a-zA-ZÀ-ÿ\s]{1,100}$/),
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
    check('correo', 'Ingrese un correo valido.').isEmail(),
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
router.post('/enviarContrasenaTemporal',
  [
    check('correo', 'Ingrese un correo valido.').isEmail(),
    validarCampos
  ],
  usuarioController.enviarContrasenaTemporal
)
router.post('/cambiarContrasena', [
  check('contrasena', 'Ingrese una contraseña.').not().isEmpty().trim(),
  check('contrasenaNueva', 'Ingrese una nueva contrasenña.').not().isEmpty().trim(),
  check('contrasenaConfirma', 'Ingrese una nueva contraseña.').not().isEmpty().trim(),
  check('contrasenaConfirma', 'La confirmación de la contraseña no coincide con la contraseña.').custom((value, { req }) => validaIgualCampos(value, req.body.contrasenaNueva)),
  validarCampos
], validaJWT,
usuarioController.cambiarContrasena)

router.get('/renewToken', validaJWT, usuarioController.renewToken)
module.exports = router
