const Course = require('../models/Course');
const User = require('../models/User')

class CourseController {
    // @route GET /courses/:slug
    // @desc Get course by slug
    // @access Public
    async getCourse(req, res) {
        try {
            if (req.query.id) {
                const id = req.query.id;
                console.log(id);
                const course = await Course.findOne({
                    episode: {
                        $elemMatch: {
                            lessons: {
                                $elemMatch: {
                                    id: id,
                                },
                            },
                        },
                    },
                });

                console.log('Lesson', course);
            }

            const course = await Course.findOne({ slug: req.params.slug });

            return res.json(course);
        } catch (error) {
            console.log(error.message);
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
                Course.find({ 'role.FE': 'Front-end' }).select(
                    'id slug image title studentCount'
                ),
                Course.find({ 'role.BE': 'Back-end' }).select(
                    'id slug image title studentCount'
                ),
            ]);

            return res.json({
                courseFE: data[0],
                courseBE: data[1],
            });
        } catch (error) {
            console.log(error.message);
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

            const course = await Course.findById(courseId);
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

            return res.json({
                success: true,
                message: 'Enroll successfully!',
                course,
            });
        } catch (error) {
            console.log(error.message);
            return res.json({
                success: false,
                message: 'Enroll failed!',
            });
        }
    }
}

module.exports = new CourseController();
