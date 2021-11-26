const { Router } = require('express')
const usuarioRouter = require('./api/user/router')

const router = Router()
router.use('/user', usuarioRouter)
module.exports = router
