const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    minSalary: Number,
    maxSalary: Number,
    languages: [String],
    postedBy: { type: ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('jobs', JobSchema)
