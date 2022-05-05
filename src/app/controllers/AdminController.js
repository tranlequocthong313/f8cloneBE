const Blog = require('../models/Blog')
const Course = require('../models/Course')
const Video = require('../models/Video')
const createError = require('http-errors')

class AdminController {
  // @route PATCH /course/add-popular
  // @desc Add course to popular course
  // @access Private
  async addCoursePopular(req, res, next) {
    try {
      const { courseId, isPopular } = req.body

      await Course.updateOne(
        { _id: courseId },
        {
          $set: { isPopular: !isPopular },
        }
      )

      const course = await Course.find().sort({ createdAt: -1 })
      return res.status(200).json(course)
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({
        success: false,
        message: 'Add Failed!',
      })
    }
  }

  // @route DELETE /course/delete-soft
  // @desc Delete soft course
  // @access Private
  async deleteCourseSoft(req, res, next) {
    try {
      const { courseId } = req.body

      await Course.delete({ _id: { $in: courseId } })
      const course = await Course.find().sort({ createdAt: -1 })
      return res.status(200).json(course)
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({
        success: false,
        message: 'Delete Failed!',
      })
    }
  }

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
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route DELETE /blog/delete-soft
  // @desc Delete soft blog
  // @access Private
  async deleteBlogSoft(req, res, next) {
    try {
      const { blogId } = req.body

      await Blog.delete({ _id: { $in: blogId } })
      const blog = await Blog.find().sort({ createdAt: -1 })
      return res.status(200).json(blog)
    } catch (error) {
      console.log(error.message)
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

      await Blog.updateOne(
        { _id: blogId },
        {
          $set: { isPopular: !isPopular },
        }
      )

      const blog = await Blog.find().sort({ createdAt: -1 })
      return res.status(200).json(blog)
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({
        success: false,
        message: 'Add Failed!',
      })
    }
  }

  // @route POST /video/create
  // @desc Create video
  // @access Private
  async createVideo(req, res, next) {
    try {
      const video = await Video.create(req.body)
      return res.status(200).json(video)
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }

  // @route DELETE /video/delete-soft
  // @desc Delete soft video
  // @access Private
  async deleteVideoSoft(req, res, next) {
    try {
      const { videoId } = req.body

      await Video.delete({ _id: { $in: req.body.videoId } })
      const video = await Video.find().sort({ createdAt: -1 })

      return res.status(200).json(video)
    } catch (error) {
      console.log(error.message)
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

      await Video.updateOne(
        { _id: videoId },
        {
          $set: { isPopular: !isPopular },
        }
      )

      const video = await Video.find().sort({ createdAt: -1 })
      return res.status(200).json(video)
    } catch (error) {
      console.log(error.message)
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
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new AdminController()
