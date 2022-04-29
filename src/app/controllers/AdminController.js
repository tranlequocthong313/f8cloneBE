const Blog = require('../models/Blog')
const Course = require('../models/Course')
const Video = require('../models/Video')
const createError = require('http-errors')

class AdminController {
  // @route PATCH /blog/verify
  // @desc Verify blog
  // @access Private
  async verifyBlog(req, res, next) {
    try {
      const { isVerified, blogId } = req.body

      console.log(isVerified)

      isVerified
        ? await Blog.updateOne({ _id: blogId }, { isVerified: true })
        : await Blog.delete({ _id: blogId })

      return res.status(200).json({
        success: true,
        message: 'Successfully!',
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route DELETE /blog/delete-soft
  // @desc Delete soft blog by youtube blogId
  // @access Private
  async deleteBlogSoft(req, res, next) {
    try {
      const { blogId } = req.body

      await Blog.delete({ _id: { $in: blogId } })
      const blog = await Blog.find().sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Delete Successfully!',
        blog,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Delete Failed!',
      })
    }
  }

  // @route PATCH /blog/add-popular
  // @desc Add blog to popular blog
  // @access Private
  async addBlogPopular(req, res, next) {
    try {
      const { blogId, isPopular } = req.body

      const blog = await Blog.findOneAndUpdate(
        { _id: blogId },
        {
          $set: { isPopular: !isPopular },
        }
      ).sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Add Successfully!',
        blog,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Add Failed!',
      })
    }
  }

  // @route POST /video/create
  // @desc Create video by youtube videoId
  // @access Private
  async createVideo(req, res, next) {
    try {
      const video = await Video.create(req.body)
      return res.status(200).json({
        success: true,
        message: 'Create Successfully!',
        video,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }

  // @route DELETE /video/delete-soft
  // @desc Delete soft video by youtube videoId
  // @access Private
  async deleteVideoSoft(req, res, next) {
    try {
      const { videoId } = req.body

      await Video.delete({ _id: { $in: req.body.videoId } })
      const video = await Video.find().sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Delete Successfully!',
        video,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Delete Failed!',
      })
    }
  }

  // @route PATCH /video/add-popular
  // @desc Add video to popular video
  // @access Private
  async addVideoPopular(req, res, next) {
    try {
      const { videoId, isPopular } = req.body

      const video = await Video.findOneAndUpdate(
        { _id: videoId },
        {
          $set: { isPopular: !isPopular },
        }
      ).sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Add Popular Successfully!',
        video,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Add Popular Failed!',
      })
    }
  }

  // @route GET /
  // @desc Get data
  // @access Private
  async getData(req, res, next) {
    try {
      const data = await Promise.all([
        Course.find(),
        Blog.find({ schedule: null, isPosted: true }).populate('postedBy'),
        Video.find().sort({ createdAt: -1 }),
      ])

      return res.status(200).json({
        course: data[0],
        blogs: data[1],
        videos: data[2],
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new AdminController()
