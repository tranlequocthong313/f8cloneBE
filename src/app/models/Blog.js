const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')
const mongooseDelete = require('mongoose-delete')

mongoose.plugin(slug)

const BlogSchema = new Schema(
  {
    title: { type: String },
    search: { type: String },
    content: { type: String },
    readingTime: { type: Number },
    image: String,
    titleDisplay: String,
    description: String,
    tags: [{ type: String, max: 5 }],
    likes: [{ type: ObjectId, ref: 'users' }],
    schedule: String,
    postedBy: {
      type: ObjectId,
      ref: 'users',
    },
    allowRecommend: Boolean,
    isPopular: Boolean,
    isVerified: Boolean,
    isPosted: { type: Boolean, default: false },
    comments: [{ type: ObjectId, ref: 'comments' }],
  },
  {
    timestamps: true,
  }
)

BlogSchema.plugin(mongooseDelete, {
  overrideMethods: ['find', 'findOne'],
  deletedAt: true,
})

module.exports = mongoose.model('blogs', BlogSchema)
