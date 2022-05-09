const express = require('express')
const router = express.Router()
const LessonController = require('../app/controllers/LessonController')
const verifyToken = require('../middleware/verifyToken')

router.post('/create-lesson/:courseId', LessonController.createLesson)
router.put(
  '/edit-lesson/:courseId/:prevEpisodeId/:lessonId',
  LessonController.editLesson
)

module.exports = router
