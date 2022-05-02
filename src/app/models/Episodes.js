const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types

const EpisodeSchema = new Schema(
  {
    title: String,
    lessons: { type: ObjectId, ref: 'lessons' },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('episodes', EpisodeSchema)
