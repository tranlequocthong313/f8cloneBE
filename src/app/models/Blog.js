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
    tags: {
      type: [String],
      validate: {
        validator: function (v) {
          return !v || v?.length <= 5;
        },
      },
    },
    likes: [{ type: ObjectId, ref: 'users' }],
    slug: {
      type: String,
      slug: 'title',
      slugPaddingSize: 4,
      unique: true,
      index: true
    },
    schedule: String,
    postedBy: {
      type: ObjectId,
      ref: 'users',
      required: true
    },
    allowRecommend: Boolean,
    isPopular: Boolean,
    isVerified: Boolean,
    isPosted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

BlogSchema.plugin(mongooseDelete, {
  overrideMethods: ['find', 'findOne'],
  deletedAt: true,
})

BlogSchema.index({ tags: 1 });
BlogSchema.index({ postedBy: 1 });

module.exports = mongoose.model('blogs', BlogSchema)
