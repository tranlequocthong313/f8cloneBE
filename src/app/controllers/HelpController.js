const Job = require('../models/Job')
const Course = require('../models/Course')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const User = require('../models/User')
const Contact = require('../models/Contact')
const createError = require('http-errors')

class HelpController {
  // @route PATCH /setting/fullName
  // @desc Change fullName
  // @access Private
  async changeFullName(req, res, next) {
    try {
      const { _id } = req
      const { fullName } = req.body

      const fullNameUpdated = await User.findOneAndUpdate(
        { _id },
        {
          $set: { fullName },
        },
        { new: true }
      ).select('fullName')

      return res.json(fullNameUpdated)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /setting/avatar
  // @desc Change avatar
  // @access Private
  async changeAvatar(req, res, next) {
    try {
      const { _id } = req
      const { photoURL } = req.body

      const avatar = await User.findOneAndUpdate(
        { _id },
        {
          $set: { photoURL },
        },
        { new: true }
      ).select('photoURL')

      return res.json(avatar)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /setting/bio
  // @desc Change avatar
  // @access Private
  async changeBio(req, res, next) {
    try {
      const { _id } = req
      const { bio } = req.body

      const bioUpdated = await User.findOneAndUpdate(
        { _id },
        {
          $set: { bio },
        },
        { new: true }
      ).select('bio')

      return res.json(bioUpdated)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /setting/social
  // @desc Change social
  // @access Private
  async changeSocial(req, res, next) {
    try {
      const { _id } = req
      const { fb, youtube, instagram, linkedin, twitter } = req.body

      const social = await User.findById(_id).select('socials')

      const socials = await User.findOneAndUpdate(
        { _id },
        {
          $set: {
            socials: {
              fb: fb ? fb : social.fb,
              youtube: youtube ? youtube : social.youtube,
              instagram: instagram ? instagram : social.instagram,
              linkedin: linkedin ? linkedin : social.linkedin,
              twitter: twitter ? twitter : social.twitter,
            },
          },
        },
        { new: true }
      ).select('socials')

      console.log(socials)

      return res.json(socials)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /my-post
  // @desc Get my blog
  // @access Private
  async getMyPost(req, res, next) {
    try {
      const { _id } = req

      const myBlog = await Blog.find({
        postedBy: _id,
        isPosted: true,
      }).sort({ createdAt: -1 })

      return res.json(myBlog)
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Get my blog failed!',
      })
    }
  }

  // @route POST /new-job
  // @desc Post new job
  // @access Public
  async newJob(req, res, next) {
    try {
      const jobs = await Job.create({
        ...req.body,
        postedBy: req._id,
      })

      return res.json(jobs)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /get-job
  // @desc Get all job
  // @access Public
  async getJob(req, res, next) {
    try {
      const jobs = await Job.find()

      return res.json(jobs)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /search/:text
  // @desc Search
  // @access Public
  async search(req, res, next) {
    try {
      const { text } = req.params

      const data = await Promise.all([
        Course.find({
          $or: [
            {
              title: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
            {
              search: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
            {
              description: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
          ],
        }).select('_id slug image title description'),
        Blog.find({
          $or: [
            {
              titleDisplay: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
            {
              search: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
            {
              content: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
          ],
          isPosted: true,
          isVerified: true,
          schedule: null,
        })
          .select('_id slug titleDisplay image likes comments')
          .populate('postedBy', 'photoURL'),
        Video.find({
          $or: [
            {
              title: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
            {
              search: {
                $regex: new RegExp('.*' + text + '.*', 'i'),
              },
            },
          ],
        }).select('_id videoId title image'),
      ])

      return res.json({
        courses: data[0],
        blogs: data[1],
        videos: data[2],
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /help/contact
  // @desc Post Contact
  // @access Public
  async contact(req, res, next) {
    try {
      const contact = await Contact.create(req.body)
      return res.json({
        success: true,
        message: 'Post success',
        contact,
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new HelpController()
