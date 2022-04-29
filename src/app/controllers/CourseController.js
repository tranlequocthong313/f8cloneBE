const Course = require('../models/Course')
const createError = require('http-errors')

class CourseController {
  // @route GET /courses/:slug
  // @desc Get course by slug
  // @access Public
  async getCourse(req, res, next) {
    try {
      const { id } = req.query
      const { slug } = req.params

      if (id) {
        const course = await Course.findOne({
          episode: {
            $elemMatch: {
              lessons: {
                $elemMatch: {
                  id,
                },
              },
            },
          },
        })
      }

      const course = await Course.findOne({ slug: slug })

      return res.status(200).json(course)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /courses
  // @desc Get all course by role
  // @access Public
  async getCourseByRole(req, res, next) {
    try {
      const data = await Promise.all([
        Course.find({ 'role.FE': 'Front-end' }).select(
          'id slug image title studentCount'
        ),
        Course.find({ 'role.BE': 'Back-end' }).select(
          'id slug image title studentCount'
        ),
      ])

      return res.status(200).json({
        courseFE: data[0],
        courseBE: data[1],
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new CourseController()
