const express = require('express')
const router = express.Router()
const LessonController = require('../app/controllers/LessonController')
const checkIsAdmin = require('../helper/checkIsAdmin')
const verifyToken = require('../middleware/verifyToken')

router.post(
  '/create-lesson/:courseId',
  verifyToken,
  checkIsAdmin,
  LessonController.createLesson
)
router.put(
  '/edit-lesson/:courseId/:prevEpisodeId/:lessonId',
  verifyToken,
  checkIsAdmin,
  LessonController.editLesson
)

module.exports = router
