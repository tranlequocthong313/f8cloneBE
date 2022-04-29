const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    post: {
      type: ObjectId,
      refPath: 'commentType',
    },
    commentType: { type: String, enum: ['blogs', 'courses'] },
    postedBy: { type: ObjectId, ref: 'users' },
    likes: [{ type: ObjectId, ref: 'users' }],
    isCode: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('comments', CommentSchema)
