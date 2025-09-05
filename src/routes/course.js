const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');
const verifyToken = require('../middleware/verifyToken');

router.get('/:id/progress', verifyToken, courseController.getLearningProgress);
router.put(
    '/:id/progress',
    verifyToken,
    courseController.updateLearningProgress
);
router.put('/:id/enroll', verifyToken, courseController.enrollCourse);
router.get('/:slug', courseController.getCourse);
// router.get('/', courseController.getCourseByRole);

module.exports = router;
