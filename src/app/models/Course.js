const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug)

const CourseSchema = new Schema(
  {
    title: { type: String },
    search: { type: String },
    description: {
      type: String,
    },
    videoId: {
      type: String,
    },
    image: String,
    level: {
      type: String,
    },
    studentCount: { type: Number, default: 0 },
    goals: { type: Array },
    requirement: [String],
    role: String,
    isPopular: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

CourseSchema.plugin(mongooseDelete, {
  overrideMethods: ['find', 'findOne'],
  deletedAt: true,
})

module.exports = mongoose.model('courses', CourseSchema)
