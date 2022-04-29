const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController')
const verifyToken = require('../middleware/verifyToken')

router.patch('/bookmark', verifyToken, userController.bookmark)
router.get('/bookmark', verifyToken, userController.getBookmark)
router.get(
  '/bookmark-post',
  verifyToken,
  userController.getBookmarkAndBlogAuthor
)
router.post('/check-email', userController.checkEmail)
router.post('/phone-number', userController.checkPhoneNumberExist)
router.post('/provider', userController.loginWithProvider)
router.post('/email-password', userController.login)
router.post('/reset-password', userController.resetPassword)
router.post('/verify', userController.verify)
router.get('/auth', verifyToken, userController.getUser)
router.post('/', userController.register)

module.exports = router
