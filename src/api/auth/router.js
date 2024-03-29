const { Router } = require('express')
const authController = require('./controller')
const router = Router()
const validateJWT = require('../../middlewares/validateJwt')
const valid = require('./validators')

router.post(
  '/login',
  valid.login,
  authController.login
)

router.get(
  '/renewToken',
  validateJWT,
  authController.renewToken)

router.get(
  '/user',
  validateJWT,
  authController.user
)

router.put(
  '/update',
  valid.update,
  validateJWT,
  authController.update
)

router.post('/sendTempPassword',
  valid.sendTempPassword,
  authController.sendTempPassword
)
router.post('/changePassowrd',
  valid.changePassword,
  validateJWT,
  authController.changePassword)

module.exports = router
