const Course = require('../models/Course')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const Notification = require('../models/Notification')

class NotificationController {
  // @route POST /new-notification
  // @desc Post new notification
  // @access Private
  async newNotify(req, res) {
    try {
      const { sendFor } = req.body

      await Notification.create(req.body)

      const notification = await Notification.find({
        sendFor,
      })
        .populate('notifiedBy')
        .sort({ createdAt: -1 })

      return res.json(notification)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PUT /seen-notification
  // @desc Seen notification
  // @access Private
  async seenNotification(req, res) {
    try {
      const { notificationId } = req.body
      const { _id } = req

      await Notification.updateMany(
        {
          _id: { $in: notificationId },
        },
        { $set: { isSeen: true } }
      )
      const notification = await Notification.find({ sendFor: _id })
        .populate('notifiedBy')
        .sort({ createdAt: -1 })

      res.json(notification)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET /
  // @desc Get notification
  // @access Private
  async getNotification(req, res) {
    try {
      const { _id } = req

      const notification = await Notification.find({
        sendFor: _id,
      })
        .populate('notifiedBy')
        .sort({ createdAt: -1 })

      res.json(notification)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new NotificationController()
