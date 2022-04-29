const Blog = require('../models/Blog')
const User = require('../models/User')
const handleSchedule = require('node-schedule')
const createError = require('http-errors')
const Comment = require('../models/Comment')

class BlogController {
  // @route POST /new-post
  // @desc Post new blog
  // @access Private
  async postNewBlog(req, res, next) {
    try {
      const { schedule } = req.body

      const blog = await Blog.create({
        ...req.body,
        postedBy: req._id,
      })

      const { _id } = blog

      if (schedule) {
        handleSchedule.scheduleJob(
          schedule,
          async () =>
            await Blog.updateOne(
              { _id },
              {
                schedule: null,
              }
            )
        )
      }

      return res.status(200).json({
        success: true,
        message: 'Post blog successfully!',
        blog,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Post blog failed!',
      })
    }
  }

  // @route GET /blog
  // @desc Get all blog
  // @access Public
  async getAllBlog(req, res, next) {
    try {
      const allBlog = await Blog.find({
        schedule: null,
        isVerified: true,
        isPosted: true,
      })
        .populate('postedBy')
        .sort({ createdAt: -1 })

      return res.status(200).json(allBlog)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Get blog failed!',
      })
    }
  }

  // @route GET /blog/:_id || /blog/edit-blog/:_id
  // @desc Get blog by id
  // @access Public
  async getBlog(req, res, next) {
    try {
      const { _id } = req.params

      const blogData = await Promise.all([
        Blog.findOne({
          _id,
          schedule: null,
          isPosted: true,
        }).populate('postedBy'),
        Blog.find({ isPopular: true, isPosted: true }).populate('postedBy'),
      ])

      return res.status(200).json({
        blogSlug: blogData[0],
        blogHighlight: blogData[1],
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /blog/tag/:tag
  // @desc Get blog by tag
  // @access Public
  async getBlogTag(req, res, next) {
    try {
      const { tag } = req.params

      const blogTagData = await Blog.find({
        schedule: null,
        isVerified: true,
        isPosted: true,
        tags: tag,
      })
        .populate('postedBy')
        .sort({ createdAt: -1 })

      return res.status(200).json(blogTagData)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /blog/edit-blog/:_id
  // @desc Get edit blog
  // @access Private
  async getEditBlog(req, res, next) {
    try {
      const { _id } = req.params

      const blogEditData = await Blog.findById({ _id })

      return res.json(blogEditData)
    } catch (error) {
      console.log(error)
      next(createError.InternalServerError())
    }
  }

  // @route PUT /blog/edit-blog/:_id
  // @desc Edit blog
  // @access Private
  async editBlog(req, res, next) {
    try {
      const { _id } = req.params
      const { title, content } = req.body

      await Blog.updateOne(
        { _id },
        {
          $set: {
            title,
            content,
          },
        }
      )

      return res.status(200).json({
        success: true,
        message: 'Edit blog successfully!',
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: 'Edit blog failed!',
      })
    }
  }

  // @route DELETE /blog/delete-blog
  // @desc Delete blog
  // @access Private
  async deleteBlog(req, res, next) {
    try {
      const { _id } = req
      const { blogId } = req.params

      await Blog.delete({ _id: blogId })

      const blog = await Blog.find({ postedBy: _id })

      return res.json(blog)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /blog/same-author/:id
  // @desc Get bog same author
  // @access Public
  async getBlogSameAuthor(req, res, next) {
    try {
      const { authorId, blogId } = req.params

      const blogSameAuthor = await Blog.find({
        postedBy: authorId,
        _id: { $ne: blogId },
        schedule: null,
        isPosted: true,
      }).select('titleDisplay')

      return res.status(200).json(blogSameAuthor)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Get blog failed!',
      })
    }
  }

  // @route PATCH /blog/like/:blogId
  // @desc Like blog
  // @access Private
  async like(req, res, next) {
    try {
      const { _id } = req
      const { blogId } = req.params

      const likes = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: _id },
        },
        { new: true }
      ).select('likes')

      return res.status(200).json(likes)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /blog/unlike/:blogId
  // @desc Unlike blog
  // @access Private
  async unlike(req, res, next) {
    try {
      const { _id } = req
      const { blogId } = req.params

      const likes = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: _id },
        },
        { new: true }
      ).select('likes')

      return res.status(200).json(likes)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /get-reply
  // @desc Get reply comment
  // @access Private
  async getReplyComment(req, res, next) {
    try {
      const { blogId, commentId } = req.params

      console.log(blogId, commentId)

      const replyComment = await Blog.findOne({
        $and: [{ _id: blogId }, { 'comments._id': commentId }],
      })
        .select('comments.replies comments._id')
        .populate('comments.replies.postedBy', '_id fullName photoURL')

      return res.status(200).json(replyComment)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PUT /reply
  // @desc Reply comment
  // @access Private
  async replyComment(req, res, next) {
    try {
      const { _id } = req
      const { blogId, commentId } = req.body

      const comments = await Blog.findOneAndUpdate(
        {
          $and: [{ _id: blogId }, { 'comments._id': commentId }],
        },
        {
          $push: {
            'comments.$.replies': {
              $each: [
                {
                  ...req.body,
                  postedBy: _id,
                },
              ],
            },
          },
        },
        {
          new: true,
        }
      )
        .select('comments.replies comments._id')
        .populate('comments.replies.postedBy', '_id fullName photoURL')

      return res.status(200).json(comments)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Reply error',
      })
    }
  }

  // @route PUT /comment/react
  // @desc React comment
  // @access Private
  async reactComment(req, res, next) {
    try {
      const { _id } = req
      const { commentId, emoji } = req.body

      const comments = await Blog.findOneAndUpdate(
        { 'comments._id': commentId },
        {
          $push: {
            'comments.$.reacts': {
              emoji,
              reactedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      )
        .select('comments')
        .populate('comments.postedBy', '_id fullName photoURL')
        .populate('comments.reacts.reactedBy', '_id fullName photoURL')

      return res.status(200).json(comments)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'React failed!',
      })
    }
  }

  // @route PUT blog/comment/edit
  // @desc Edit comment
  // @access Private
  async editComment(req, res, next) {
    try {
      const { commentId, conetnt, isCode } = req.body

      const comments = await Blog.findOneAndUpdate(
        { 'comments._id': commentId },
        {
          $set: {
            'comments.$.content': content,
            'comments.$.isCode': isCode,
          },
        },
        { new: true }
      )
        .select('comments')
        .populate('comments.postedBy', '_id fullName photoURL')

      return res.status(200).json(comments)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Edit comment failed!',
      })
    }
  }

  // @route PUT blog/comment/delete
  // @desc Delete comment
  // @access Private
  async deleteComment(req, res, next) {
    const { commentId } = req.body

    try {
      const comments = await Blog.findOneAndUpdate(
        { 'comments._id': commentId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      )
        .select('comments')
        .populate('comments.postedBy', '_id fullName photoURL')

      return res.status(200).json(comments)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: 'Delete comment failed!',
      })
    }
  }
}

module.exports = new BlogController()
