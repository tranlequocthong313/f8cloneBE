const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const ReportSchema = new Schema(
  {
    commentId: { type: ObjectId, ref: 'blogs' },
    blogId: { type: ObjectId, ref: 'blogs' },
    courseId: { type: ObjectId, ref: 'courses' },
    reportedBy: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('reports', ReportSchema)
