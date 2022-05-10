const express = require('express')
const router = express.Router()
const courseController = require('../app/controllers/CourseController')
const checkIsAdmin = require('../helper/checkIsAdmin')
const verifyToken = require('../middleware/verifyToken')

router.post('/create', verifyToken, checkIsAdmin, courseController.createCourse)
router.put(
  '/add-episode/:courseId',
  verifyToken,
  checkIsAdmin,
  courseController.addEpisode
)
router.patch(
  '/edit-episode/:courseId/:episodeId',
  verifyToken,
  checkIsAdmin,
  courseController.editEpisode
)
router.delete(
  '/delete-episode/:courseId/:episodeId',
  verifyToken,
  checkIsAdmin,
  courseController.deleteEpisode
)
router.put('/edit/:_id', verifyToken, checkIsAdmin, courseController.editCourse)
router.patch(
  '/delete-lesson/:courseId/:episodeId/:lessonId',
  verifyToken,
  checkIsAdmin,
  courseController.deleteLesson
)
router.get('/:_id', courseController.getCourseById)
router.get('/:_id/lessons', courseController.getLessonsByCourseId)
router.get('/', courseController.getAllCourse)

module.exports = router
