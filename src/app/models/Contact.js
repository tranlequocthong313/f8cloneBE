const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const ContactSchema = new Schema(
  {
    fullName: String,
    email: String,
    phoneNumber: String,
    content: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('contacts', ContactSchema)
