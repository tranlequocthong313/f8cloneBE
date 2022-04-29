const Report = require('../models/Report')

class ReportController {
  // @route PUT /report/blog
  // @desc Report a blog
  // @access Private
  async reportBlog(req, res, next) {
    try {
      return res.json({
        success: true,
        message: 'Report successfully!',
      })
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Report failed!',
      })
    }
  }

  // @route PUT /report/comment
  // @desc Report a comment
  // @access Private
  async reportComment(req, res, next) {
    try {
      const { _id } = req
      const { commentId } = req.body

      const report = await Report.create({
        commentId,
        reportedBy: _id,
      })

      return res.json({
        success: true,
        message: 'Report successfully!',
        report,
      })
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Report failed!',
      })
    }
  }
}

module.exports = new ReportController()
