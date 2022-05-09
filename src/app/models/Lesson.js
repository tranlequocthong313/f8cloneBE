const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const LessonSchema = new Schema(
  {
    title: String,
    videoId: String,
    duration: String,
    comments: [{ type: ObjectId, ref: 'comments' }],
    episodeParent: String,
    postedBy: {
      type: ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('lessons', LessonSchema)
