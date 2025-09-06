const express = require('express');
const router = express.Router();
const CourseController = require('../app/controllers/CourseController');
const verifyToken = require('../middleware/verifyToken');

// router.get('/lessons', CourseController.getLessons)
// router.put('/lessons/:id', CourseController.updateLesson)
router.get('/:id/progress', verifyToken, CourseController.getLearningProgress);
router.put(
    '/:id/progress',
    verifyToken,
    CourseController.updateLearningProgress
);
router.put('/:id/enroll', verifyToken, CourseController.enrollCourse);
router.get('/:slug', CourseController.getCourse);
// router.get('/', courseController.getCourseByRole);

module.exports = router;
