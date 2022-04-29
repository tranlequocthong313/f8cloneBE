const Course = require('../models/Course')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const Notification = require('../models/Notification')
const createError = require('http-errors')

class NotificationController {
  // @route POST /new-notification
  // @desc Post new notification
  // @access Private
  async newNotify(req, res, next) {
    try {
      const notification = await Notification.create(req.body)
      return res.json(notification)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route DELETE /seen-notification
  // @desc Seen notification
  // @access Private
  async seenNotification(req, res, next) {
    try {
      const { notificationId } = req.body
      const { _id } = req

      await Notification.deleteMany({
        _id: { $in: notificationId },
      })

      const notification = await Notification.find({
        receiverId: _id,
      }).sort({ createdAt: -1 })

      return res.json(notification)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /
  // @desc Get notification
  // @access Private
  async getNotification(req, res, next) {
    try {
      const { _id } = req

      const notification = await Notification.find({
        receiverId: _id,
      }).sort({ createdAt: -1 })

      return res.json(notification)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new NotificationController()
