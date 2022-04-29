const express = require('express')
const router = express.Router()
const NotificationController = require('../app/controllers/NotificationController')
const verifyToken = require('../middleware/verifyToken')

router.post('/new-notification', NotificationController.newNotify)
router.delete(
  '/seen-notification',
  verifyToken,
  NotificationController.seenNotification
)
router.get('/', verifyToken, NotificationController.getNotification)

module.exports = router
