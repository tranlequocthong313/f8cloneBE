const Course = require('../models/Course')
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const { create } = require('../models/Course')

class CourseController {
  // @route GET /courses/:_id
  // @desc Get course by id
  // @access Public
  async getCourseById(req, res, next) {
    try {
      const { _id } = req.params

      const course = await Course.findById(_id).populate('episodes.lessons')
      return res.status(200).json(course)
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

  // @route PUT /add-episode/:courseId
  // @desc Add episode
  // @access Private
  async addEpisode(req, res, next) {
    try {
      const { courseId } = req.params
      const { title } = req.body

      const episodes = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $push: { episodes: { _id: uuidv4(), title } },
        },
        { new: true }
      )
        .select('episodes -_id')
        .populate('episodes.lessons')
      return res.status(200).json(episodes)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /edit-episode/:courseId/:episodeId
  // @desc Add episode
  // @access Private
  async editEpisode(req, res, next) {
    try {
      const { courseId, episodeId } = req.params
      const { title } = req.body

      const episodes = await Course.findOneAndUpdate(
        { _id: courseId, 'episodes._id': episodeId },
        {
          $set: { 'episodes.$.title': title },
        },
        { new: true }
      )
        .select('episodes -_id')
        .populate('episodes.lessons')
      return res.status(200).json(episodes)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route DELETE /delete-episode/:courseId/:episodeId
  // @desc Delete episode
  // @access Private
  async deleteEpisode(req, res, next) {
    try {
      const { courseId, episodeId } = req.params
      const { title } = req.body

      const episodes = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $pull: { episodes: { _id: episodeId } },
        },
        { new: true }
      )
        .select('episodes -_id')
        .populate('episodes.lessons')
      return res.status(200).json(episodes)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /delete-lesson/:courseId/:episodeId/:lessonId
  // @desc Delete lesson
  // @access Private
  async deleteLesson(req, res, next) {
    try {
      const { courseId, episodeId, lessonId } = req.params

      const episodes = await Course.findOneAndUpdate(
        { _id: courseId, 'episodes._id': episodeId },
        {
          $pull: { 'episodes.$.lessons': lessonId },
        },
        { new: true }
      )
        .populate('episodes.lessons')
        .select('episodes -_id')

      return res.status(200).json(episodes)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new CourseController()
