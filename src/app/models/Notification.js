const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const NotificationSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    slug: String,
    notifiedBy: { type: ObjectId, ref: 'users' },
    sendFor: String,
    isSeen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('notifications', NotificationSchema)
