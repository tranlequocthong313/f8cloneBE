const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')

const VideoSchema = new Schema(
  {
    videoId: { type: String, required: true },
    duration: { type: String, required: true },
    title: { type: String, required: true },
    search: { type: String, required: true },
    image: { type: String, required: true },
    viewCount: Number,
    likeCount: Number,
    commentCount: Number,
    isPopular: Boolean,
  },
  {
    timestamps: true,
  },
)

VideoSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
})

module.exports = mongoose.model('videos', VideoSchema)
