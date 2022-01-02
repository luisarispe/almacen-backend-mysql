const { Router } = require('express')
const userController = require('./controller')
const router = Router()
const validateJWT = require('../../middlewares/validateJwt')

router.get(
  '/listMenu',
  validateJWT,
  userController.listMenu
)

module.exports = router
