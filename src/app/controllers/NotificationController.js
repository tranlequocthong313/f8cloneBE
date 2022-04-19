const Course = require('../models/Course')
const Blog = require('../models/Blog')
const Video = require('../models/Video')
const Notification = require('../models/Notification')
const cache = require('../../utils/Cache')

class NotificationController {
  // @route POST /new-notification
  // @desc Post new notification
  // @access Private
  async newNotify(req, res) {
    try {
      await Notification.create(req.body)

      const notification = await Notification.find({
        sendFor: req.body.sendFor,
      })
        .populate('notifiedBy')
        .sort({ createdAt: -1 })

      return res.json(notification)
    } catch (error) {
      console.log(error.message)
    }
  }

  // @route POST /seen-notification
  // @desc Seen notification
  // @access Private
  async seenNotification(req, res) {
    try {
      console.log(req.body.notificationId)
      await Notification.updateMany(
        {
          _id: { $in: req.body.notificationId },
        },
        { $set: { isSeen: true } },
      )
      const notification = await Notification.find({ sendFor: req._id })
        .populate('notifiedBy')
        .sort({ createdAt: -1 })

      res.json(notification)
    } catch (error) {
      console.log(error.message)
    }
  }

  // @route GET /
  // @desc Get notification
  // @access Private
  async getNotification(req, res) {
    try {
      const notification = await Notification.find({
        sendFor: req._id,
      })
        .populate('notifiedBy')
        .sort({ createdAt: -1 })

      res.json(notification)
    } catch (error) {
      console.log(error.message)
    }
  }
}

module.exports = new NotificationController()
