const Course = require('../models/Course');
const LearnProgress = require('../models/LearnProgress');
const User = require('../models/User');

class CourseController {
    // @route GET /courses/:slug
    // @desc Get course by slug
    // @access Public
    async getCourse(req, res) {
        try {
            const course = await Course.findOne({
                slug: req.params.slug,
            })
                .populate({
                    path: 'episodes',
                    populate: {
                        path: 'lessons',
                    },
                })
                .lean();
            return res.json(course);
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Internal error!',
            };
        }
    }

    // @route GET /courses
    // @desc Get all course by role
    // @access Public
    async getCourseByRole(req, res) {
        try {
            const data = await Promise.all([
                Course.find({ role: { $in: ['FE', 'Fullstack'] } })
                    .select('id slug image title studentCount')
                    .lean(),
                Course.find({ role: { $in: ['FE', 'Fullstack'] } })
                    .select('id slug image title studentCount')
                    .lean(),
            ]);

            return res.json({
                courseFE: data[0],
                courseBE: data[1],
            });
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Internal error!',
            };
        }
    }

    // @route PUT /courses/:id/enroll/
    // @desc Enroll course
    // @access Private
    async enrollCourse(req, res) {
        try {
            const userId = req._id;
            const courseId = req.params.id;

            const user = await User.findById(userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: 'User not found' });
            }

            const course = await Course.findById(courseId).populate({
                path: 'episodes',
                populate: {
                    path: 'lessons',
                },
            });
            if (!course) {
                return res
                    .status(404)
                    .json({ success: false, message: 'Course not found' });
            }

            if (user.coursesEnrolled.includes(courseId)) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already enrolled this course',
                });
            }

            user.coursesEnrolled.push(courseId);
            await user.save();

            course.studentCount += 1;
            await course.save();

            const lessons = course.episodes.flatMap((ep) => ep.lessons);
            const lessonProgress = lessons.map((lesson, index) => ({
                lessonId: lesson._id,
                status: index === 0 ? 'in-progress' : 'locked',
                startedAt: index === 0 ? new Date() : null,
            }));

            const learnProgress = new LearnProgress({
                userId: user._id,
                courseId: course._id,
                lessons: lessonProgress,
            });

            await learnProgress.save();

            return res.json({
                success: true,
                message: 'Enroll successfully!',
                course,
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Enroll failed!',
            });
        }
    }

    // @route GET /courses/:id/progress/
    // @desc Get learning progress
    // @access Private
    async getLearningProgress(req, res) {
        try {
            const progress = await LearnProgress.findOne({
                courseId: req.params.id,
                userId: req._id,
            }).lean();

            return res.json({
                progress,
                success: true,
                message: 'Get progress successfully!',
            });
        } catch (error) {
            console.log(
                '🚀 ~ CourseController ~ getLearningProgress ~ error:',
                error
            );
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }

    // @route PUT /courses/:id/progress/
    // @desc Update learning progress
    // @access Private
    async updateLearningProgress(req, res) {
        try {
            const { lessonId } = req.body;

            const progress = await LearnProgress.findOne({
                courseId: req.params.id,
                userId: req._id,
            });

            if (!progress) {
                return res.status(404).json({
                    message: 'Progress not found',
                    success: false,
                });
            }

            const index = progress.lessons.findIndex(
                (lesson) => lesson.lessonId.toString() === lessonId
            );

            if (index === -1) {
                return res.status(404).json({
                    message: 'Lesson not found in progress',
                    success: false,
                });
            }

            progress.lessons[index].completedAt = new Date();
            progress.lessons[index].status = 'completed';

            if (
                index + 1 < progress.lessons.length &&
                progress.lessons[index + 1].status === 'locked'
            ) {
                progress.lessons[index + 1].startedAt = new Date();
                progress.lessons[index + 1].status = 'in-progress';
            }

            await progress.save();

            return res.json({
                progress,
                success: true,
                message: 'Get progress successfully!',
            });
        } catch (error) {
            console.log(
                '🚀 ~ CourseController ~ getLearningProgress ~ error:',
                error
            );
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }
}

module.exports = new CourseController();
