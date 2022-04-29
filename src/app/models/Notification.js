const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  description: String,
  postId: String,
  notificationType: {
    type: String,
    enum: ['like', 'comment', 'post'],
  },
  senderImage: String,
  senderName: String,
  receiverName: String,
  receiverId: { type: ObjectId, ref: 'users' },
  senderId: { type: ObjectId, ref: 'users' },
  read: { type: Boolean, default: false },
  createdAt: Date,
})

module.exports = mongoose.model('notifications', NotificationSchema)
