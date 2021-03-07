const { Router } = require('express')
const usuarioRouter = require('./api/Usuario/router')
const categoriaProductoRoter = require('./api/CategoriaProducto/router')
const productoRouter = require('./api/Producto/router')

const router = Router()
router.use('/usuario', usuarioRouter)
router.use('/categoriaproducto', categoriaProductoRoter)
router.use('/producto', productoRouter)
module.exports = router
