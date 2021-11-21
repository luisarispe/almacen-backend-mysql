const { Router } = require('express')
const usuarioRouter = require('./api/Usuario/router')

const router = Router()
router.use('/usuario', usuarioRouter)
module.exports = router
