const Course = require('../models/Course')
const createError = require('http-errors')

class CourseController {
  // @route GET /courses/:_id
  // @desc Get course by id
  // @access Public
  async getCourseById(req, res, next) {
    try {
      const { _id } = req.params

      const course = await Course.findById(_id)
      return res.status(200).json(course)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /courses/:_id/lessons
  // @desc Get lessons by course id
  // @access Private
  async getLessonsByCourseId(req, res, next) {
    try {
      const { _id } = req.params

      const lessons = await Course.findById(_id).populate('episodes.lessons')

      return res.status(200).json(lessons)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /courses
  // @desc Get all course by role
  // @access Public
  async getAllCourse(req, res, next) {
    try {
      const courses = await Course.find({ isPopular: true })
      return res.status(200).json(courses)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /create
  // @desc Create new course
  // @access Private
  async createCourse(req, res, next) {
    try {
      const course = await Course.create(req.body)
      return res.status(200).json(course)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PUT /edit
  // @desc Edit course
  // @access Private
  async editCourse(req, res, next) {
    try {
      const { _id } = req.params

      await Course.updateOne(
        { _id },
        {
          $set: req.body,
        }
      )
      const courses = await Course.find()
      return res.status(200).json(courses)
    } catch (error) {
      console.log(error)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new CourseController()
