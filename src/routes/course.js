const express = require('express')
const router = express.Router()
const courseController = require('../app/controllers/CourseController')
const verifyToken = require('../middleware/verifyToken')

router.post('/create', verifyToken, courseController.createCourse)
router.put('/add-episode/:courseId', courseController.addEpisode)
router.patch('/edit-episode/:courseId/:episodeId', courseController.editEpisode)
router.delete(
  '/delete-episode/:courseId/:episodeId',
  courseController.deleteEpisode
)
router.put('/edit/:_id', verifyToken, courseController.editCourse)
router.patch(
  '/delete-lesson/:courseId/:episodeId/:lessonId',
  verifyToken,
  courseController.deleteLesson
)
router.get('/:_id', courseController.getCourseById)
router.get('/:_id/lessons', courseController.getLessonsByCourseId)
router.get('/', courseController.getAllCourse)

module.exports = router
