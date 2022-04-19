const express = require('express')
const router = express.Router()
const reportController = require('../app/controllers/ReportController')
const verifyToken = require('../middleware/verifyToken')

router.put('/blog', verifyToken, reportController.reportBlog)
router.put('/comment', verifyToken, reportController.reportComment)

module.exports = router
