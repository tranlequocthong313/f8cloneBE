const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController')
const verifyToken = require('../middleware/verifyToken')

router.get('/courses', verifyToken, userController.getEnrolledCourse)
router.put('/enroll-course/:courseId', verifyToken, userController.enrollCourse)
router.patch(
  '/lesson-learned/:lessonId',
  verifyToken,
  userController.addLessonLearned
)
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
router.get('/check-user', verifyToken, userController.getUser)
router.post('/', userController.register)

module.exports = router
