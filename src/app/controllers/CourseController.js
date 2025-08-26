const Course = require('../models/Course');

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
}

module.exports = new CourseController();
