const Report = require('../models/Report');

class ReportController {
  // @route PUT /report/blog
  // @desc Report a blog
  // @access Private
  async reportBlog(req, res) {
    try {
      return res.json({
        success: true,
        message: 'Report successfully!',
      });
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Report failed!',
      });
    }
  }

  // @route PUT /report/comment
  // @desc Report a comment
  // @access Private
  async reportComment(req, res) {
    try {
      const report = await Report.create({
        commentId: req.body.commentId,
        reportedBy: req._id,
      });

      return res.json({
        success: true,
        message: 'Report successfully!',
        report,
      });
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Report failed!',
      });
    }
  }
}

module.exports = new ReportController();
