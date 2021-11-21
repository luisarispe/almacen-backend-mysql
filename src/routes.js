const { Router } = require('express')
const usuarioRouter = require('./api/user/router')

const router = Router()
router.use('/usuario', usuarioRouter)
module.exports = router
