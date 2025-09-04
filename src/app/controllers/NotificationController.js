const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Video = require('../models/Video');
const Notification = require('../models/Notification');
const cache = require('../../utils/Cache');

class NotificationController {
    // @route PUT /seen-notification
    // @desc Seen notification
    // @access Private
    async seenNotification(req, res) {
        try {
            const result = await Notification.updateMany(
                {
                    _id: { $in: req.body.notificationId },
                },
                { $set: { read: true } }
            );

            return res.json({
                message: 'Seen notification successfully!',
                success: true,
                updatedCount: result.modifiedCount,
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }

    // @route GET /
    // @desc Get notifications
    // @access Private
    async getNotification(req, res) {
        try {
            let notifications = await Notification.find({
                receiver: req._id,
            })
                .populate('sender')
                .populate('subject')
                .sort({ createdAt: -1 });

            for (let notif of notifications) {
                if (notif.subject?.constructor?.modelName === 'comments') {
                    await notif.subject.populate('entity');
                }
                if (notif.subject?.constructor?.modelName === 'lessons') {
                    await notif.subject.populate('course');
                }
            }

            return res.json({
                message: 'Get notifications successfully!',
                success: true,
                notifications,
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }
}

module.exports = new NotificationController();
