const express = require('express')
const router = express.Router()
const AdminController = require('../app/controllers/AdminController')
const checkIsAdmin = require('../helper/checkIsAdmin')
const verifyToken = require('../middleware/verifyToken')

router.delete(
  '/course/delete-soft',
  verifyToken,
  checkIsAdmin,
  AdminController.deleteCourseSoft
)
router.patch(
  '/course/add-popular',
  verifyToken,
  checkIsAdmin,
  AdminController.addCoursePopular
)
router.patch(
  '/blog/verify',
  verifyToken,
  checkIsAdmin,
  AdminController.verifyBlog
)
router.delete(
  '/blog/delete-soft',
  verifyToken,
  checkIsAdmin,
  AdminController.deleteBlogSoft
)
router.patch(
  '/blog/add-popular',
  verifyToken,
  checkIsAdmin,
  AdminController.addBlogPopular
)
router.post(
  '/video/create',
  verifyToken,
  checkIsAdmin,
  AdminController.createVideo
)
router.delete(
  '/video/delete-soft',
  verifyToken,
  checkIsAdmin,
  AdminController.deleteVideoSoft
)
router.patch(
  '/video/add-popular',
  verifyToken,
  checkIsAdmin,
  AdminController.addVideoPopular
)
router.get('/', verifyToken, checkIsAdmin, AdminController.getData)

module.exports = router
