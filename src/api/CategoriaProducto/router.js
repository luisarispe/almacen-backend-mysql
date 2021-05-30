const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../../middlewares/validarCampos')
const categoriaProductoController = require('./controller')
const validarJWT = require('../../middlewares/validaJwt')

const router = Router()

router.post(
  '/agregar',
  [
    check('nombre', 'La Categoría es obligatoria.').not().isEmpty(),
    validarCampos
  ],
  validarJWT,
  categoriaProductoController.agregar
)
router.get('/listar', validarJWT, categoriaProductoController.listar)

router.put(
  '/actualizar/:id',
  [
    check('nombre', 'La categoría es obligatoria.').not().isEmpty(),
    validarCampos
  ],
  validarJWT,
  categoriaProductoController.actualizar
)
router.put(
  '/cambiarEstado/:id',
  validarJWT,
  categoriaProductoController.cambiarEstado
)
module.exports = router
