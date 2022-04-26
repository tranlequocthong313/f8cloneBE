const express = require('express')
const router = express.Router()
const AdminController = require('../app/controllers/AdminController')

router.patch('/blog/verify', AdminController.verifyBlog)
router.delete('/blog/delete-soft', AdminController.deleteBlogSoft)
router.patch('/blog/add-popular', AdminController.addBlogPopular)
router.post('/video/create', AdminController.createVideo)
router.delete('/video/delete-soft', AdminController.deleteVideoSoft)
router.patch('/video/add-popular', AdminController.addVideoPopular)
router.get('/', AdminController.getData)

module.exports = router
