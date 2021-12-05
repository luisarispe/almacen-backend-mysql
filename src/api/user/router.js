const { Router } = require('express')
const userController = require('./controller')
const router = Router()
const validateJWT = require('../../middlewares/validateJwt')

const valid = require('./validators')

router.post(
  '/create',
  valid.create,
  validateJWT,
  userController.create
)
router.put(
  '/update/:id',
  valid.update,
  validateJWT,
  userController.update
)
router.post(
  '/login',
  valid.login,
  userController.login
)
router.get(
  '/user',
  validateJWT,
  userController.user
)
router.post(
  '/validateTokenExpired',
  userController.validateTokenExpired
)

router.get(
  '/list',
  validateJWT,
  userController.list
)
router.get(
  '/updateState/:id',
  validateJWT,
  userController.updateState
)

router.get('/dataUser/:id',
  validateJWT,
  userController.dataUser
)
router.post('/sendTempPassword',
  valid.sendTempPassword,
  userController.sendTempPassword
)
router.post('/changePassowrd',
  valid.changePassword,
  validateJWT,
  userController.changePassword)

router.get('/renewToken', validateJWT, userController.renewToken)
module.exports = router
