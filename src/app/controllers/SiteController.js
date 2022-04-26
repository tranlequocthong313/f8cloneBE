const Course = require('../models/Course')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const createError = require('http-errors')

class SiteController {
  // @route GET /
  // @desc Get data
  // @access Public
  async index(req, res, next) {
    try {
      const data = await Promise.all([
        Course.find({ 'role.FE': 'Front-end' }).select(
          '_id slug image title studentCount'
        ),
        Course.find({ 'role.BE': 'Back-end' }).select(
          '_id slug image title studentCount'
        ),
        Blog.find({ schedule: null, isPopular: true, isVerified: true })
          .populate('postedBy')
          .select(
            '_id slug title titleDisplay image avatar author readingTime'
          ),
        Video.find({
          isPopular: true,
        }).sort({ createdAt: -1 }),
      ])

      return res.json({
        courseFE: data[0],
        courseBE: data[1],
        blogs: data[2],
        videos: data[3],
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new SiteController()
