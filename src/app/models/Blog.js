const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')
const mongooseDelete = require('mongoose-delete')

mongoose.plugin(slug)

const commentSchema = {
  content: String,
  postedBy: { type: ObjectId, ref: 'users' },
  createdAt: { type: Date, default: () => Date.now(), immutable: true },
  isCode: { type: Boolean, default: false },
  reacts: [
    {
      reactedBy: { type: ObjectId, ref: 'users' },
      emoji: String,
    },
  ],
  replies: [
    {
      content: String,
      postedBy: { type: ObjectId, ref: 'users' },
      createdAt: { type: Date, default: () => Date.now(), immutable: true },
      isCode: { type: Boolean, default: false },
      reacts: [
        {
          reactedBy: { type: ObjectId, ref: 'users' },
          emoji: String,
        },
      ],
    },
  ],
}

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
    slug: {
      type: String,
      slug: 'title',
      slugPaddingSize: 4,
      unique: true,
    },
    likes: [{ type: ObjectId, ref: 'users' }],
    comments: [commentSchema],
    schedule: String,
    postedBy: {
      type: ObjectId,
      ref: 'users',
    },
    allowRecommend: Boolean,
    isPopular: Boolean,
    isVerified: Boolean,
    isPosted: { type: Boolean, default: false },
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
