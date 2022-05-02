const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types

const LessonSchema = new Schema(
  {
    title: String,
    description: String,
    videoId: String,
    duration: String,
    comments: [{ type: ObjectId, ref: 'comments' }],
    episodeParent: { type: ObjectId, ref: 'episodes' },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('lessons', LessonSchema)
