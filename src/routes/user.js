const express = require('express')
const router = express.Router()
const UserController = require('../app/controllers/UserController')
const verifyToken = require('../middleware/verifyToken')

router.get('/enrolled-courses', verifyToken, UserController.getUserEnrolledCourse)
router.put('/bookmark', verifyToken, UserController.bookmark)
router.get('/bookmark', verifyToken, UserController.getBookmark)
router.get(
  '/bookmark-post',
  verifyToken,
  UserController.getBookmarkAndBlogAuthor,
)
router.post('/check-email', UserController.checkEmail)
router.post('/phone-number', UserController.checkPhoneNumberExist)
router.post('/provider', UserController.loginWithProvider)
router.post('/email-password', UserController.login)
router.post('/reset-password', UserController.resetPassword)
router.post('/verify', UserController.verify)
router.get('/auth', verifyToken, UserController.getUser)
router.get('/:slug', UserController.getUserBySlug)
router.post('/', UserController.register)

module.exports = router
