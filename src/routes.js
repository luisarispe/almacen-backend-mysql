const { Router } = require('express')
const userRouter = require('./api/user/router')
const menuRouter = require('./api/menu/router')

const router = Router()
router.use('/user', userRouter)
router.use('/menu', menuRouter)
module.exports = router
