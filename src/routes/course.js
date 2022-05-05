const express = require('express')
const router = express.Router()
const courseController = require('../app/controllers/CourseController')
const verifyToken = require('../middleware/verifyToken')

router.post('/create', verifyToken, courseController.createCourse)
router.put('/edit/:_id', verifyToken, courseController.editCourse)
router.get('/:_id', courseController.getCourseById)
router.get('/:_id/lessons', courseController.getLessonsByCourseId)
router.get('/', courseController.getAllCourse)

module.exports = router
