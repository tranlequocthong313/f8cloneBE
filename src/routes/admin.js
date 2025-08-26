const express = require('express')
const router = express.Router()
const AdminController = require('../app/controllers/AdminController')

router.post('/course/create', AdminController.createCourse)
router.post('/blog/verify', AdminController.verifyBlog)
router.post('/blog/delete-soft', AdminController.deleteBlogSoft)
router.post('/blog/add-popular', AdminController.addBlogPopular)
router.post('/video/create', AdminController.createVideo)
router.post('/video/delete-soft', AdminController.deleteVideoSoft)
router.post('/video/add-popular', AdminController.addVideoPopular)
router.get('/', AdminController.getData)

module.exports = router
