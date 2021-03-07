const { Router } = require('express')
const { check } = require('express-validator')
const validarCampos = require('../../middlewares/validarCampos')
const productoController = require('./controller')
const validarJWT = require('../../middlewares/validaJwt')

const router = Router()

router.post(
  '/agregar',
  [
    check('nombre', 'El producto es obligatorio.').not().isEmpty(),
    check('cantidad', 'Debe ingresar una cantidad.').isInt(),
    check('precio', 'Debe ingresar un precio.').isInt(),
    check('idCategoria', 'Debe ingresar una categoria').not().isEmpty(),
    validarCampos
  ],
  validarJWT,
  productoController.agregar
)
router.get('/listar', validarJWT, productoController.listar)

router.put(
  '/actualizar/:id',
  [
    check('nombre', 'El producto es obligatorio.').not().isEmpty(),
    check('cantidad', 'Debe ingresar una cantidad.').isInt(),
    check('precio', 'Debe ingresar un precio.').isInt(),
    check('idCategoria', 'Debe ingresar una categoria').not().isEmpty(),
    validarCampos
  ],
  validarJWT,
  productoController.actualizar
)

router.put(
  '/cambiarEstado/:id',
  validarJWT,
  productoController.cambiarEstado
)

module.exports = router
