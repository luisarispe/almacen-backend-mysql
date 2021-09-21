const { Router } = require('express')
const usuarioController = require('./controller')
const router = Router()
const validaJWT = require('../../middlewares/validaJwt')

const valida = require('./validators')

router.post(
  '/agregar',
  valida.agregar,
  validaJWT,
  usuarioController.agregar
)
router.put(
  '/actualizar/:id',
  valida.actualizar,
  validaJWT,
  usuarioController.actualizar
)
router.post(
  '/login',
  valida.login,
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
  valida.enviarContrasenaTemporal,
  usuarioController.enviarContrasenaTemporal
)
router.post('/cambiarContrasena',
  valida.cambiarContrasena,
  validaJWT,
  usuarioController.cambiarContrasena)

router.get('/renewToken', validaJWT, usuarioController.renewToken)
module.exports = router
