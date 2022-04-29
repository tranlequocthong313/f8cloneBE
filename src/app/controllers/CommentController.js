const Comment = require('../models/Comment')
const createError = require('http-errors')
const Blog = require('../models/Blog')

class CommentController {
  // @route GET /:postId
  // @desc Get comments
  // @access Public
  async getCommentsByPostId(req, res, next) {
    try {
      const { postId } = req.params

      const comments = await Comment.find({ post: postId })
        .populate('postedBy')
        .sort({ createdAt: -1 })

      return res.status(200).json(comments)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /
  // @desc Create new comment
  // @access Private
  async createComment(req, res, next) {
    try {
      const { post } = req.body

      const newComment = await Comment.create(req.body)
      await Blog.updateOne(
        { _id: post },
        {
          $push: { comments: [newComment._id] },
        }
      )
      const comment = await Comment.find({ post })
        .populate('postedBy')
        .sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Create comment success',
        comment,
      })
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /reply
  // @desc Create new reply comment
  // @access Private
  async createReplyComment(req, res, next) {
    try {
      const { post } = req.body

      console.log(req.body)

      await Comment.create(req.body)

      const comments = await Comment.find({ post })
        .populate('postedBy')
        .sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Create reply comment success',
        comments,
      })
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PUT /:commentId
  // @desc Edit comment
  // @access Private
  async editComment(req, res, next) {
    try {
      const { commentId } = req.params
      const { content, isCode } = req.body

      const comments = await Comment.findOneAndUpdate(
        { _id: commentId },
        {
          $set: { content, isCode },
        }
      )
        .populate('postedBy')
        .sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Edit comment success',
        comments,
      })
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route DELETE /:commentId
  // @desc Delete comment
  // @access Private
  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params

      const comments = await Comment.findOneAndDelete({ _id: commentId })
        .populate('postedBy')
        .sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: 'Delete comment success',
        comments,
      })
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /like/:commentId
  // @desc Like comment
  // @access Private
  async likeComment(req, res, next) {
    try {
      const { _id } = req
      const { commentId } = req.params

      const likes = await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: { likes: _id },
        },
        { new: true }
      ).select('likes')

      console.log('LIKED: ', likes)

      return res.status(200).json(likes)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PATCH /unlike/:commentId/
  // @desc Unlike comment
  // @access Private
  async unlikeComment(req, res, next) {
    try {
      const { _id } = req
      const { commentId } = req.params

      const likes = await Comment.findByIdAndUpdate(
        commentId,
        {
          $pull: { likes: _id },
        },
        { new: true }
      ).select('likes')

      console.log('UNLIKED: ', likes)

      return res.status(200).json(likes)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new CommentController()
