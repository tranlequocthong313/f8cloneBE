const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    slug: String,
    email: { type: String, lowercase: true, sparse: true, unique: true },
    password: String,
    phoneNumber: { type: String, sparse: true, unique: true },
    photoURL: String,
    bookmark: [{ type: ObjectId, ref: 'blogs' }],
    activated: { type: Boolean, required: true },
    isAdmin: Boolean,
    provider: String,
    socials: {
      fb: String,
      youtube: String,
      linkedin: String,
      instagram: String,
      twitter: String,
    },

    bio: String,
    coursesEnrolled: [{ type: ObjectId, ref: 'courses' }],
    // activities:
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('users', UserSchema)
