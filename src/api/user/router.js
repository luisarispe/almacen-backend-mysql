const { Router } = require('express')
const userController = require('./controller')
const router = Router()
const validateJWT = require('../../middlewares/validateJwt')

const valid = require('./validators')

router.post(
  '/create',
  valid.create,
  // validateJWT,
  userController.create
)
router.put(
  '/update/:id',
  valid.update,
  validateJWT,
  userController.update
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

module.exports = router
