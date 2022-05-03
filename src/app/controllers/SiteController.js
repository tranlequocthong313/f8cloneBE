const Course = require('../models/Course')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const createError = require('http-errors')
const consoleLog = require('../../helper/consoleLog')

class SiteController {
  // @route GET /
  // @desc Get data
  // @access Public
  async index(req, res, next) {
    try {
      const data = await Promise.all([
        Course.find({ isPopular: true }).select(
          '_id  image title studentCount role'
        ),
        Blog.find({
          schedule: null,
          isPopular: true,
          isVerified: true,
        }).populate('postedBy'),
        Video.find({
          isPopular: true,
        }).sort({ createdAt: -1 }),
      ])

      return res.json({
        courses: data[0],
        blogs: data[1],
        videos: data[2],
      })
    } catch (error) {
      consoleLog(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new SiteController()
