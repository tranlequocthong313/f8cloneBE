const express = require('express')
const router = express.Router()
const BlogController = require('../app/controllers/BlogController')
const verifyToken = require('../middleware/verifyToken')

router.get('/tag/:tag', BlogController.getBlogTag)
router.delete('/delete-blog/:blogId', verifyToken, BlogController.deleteBlog)
router.get('/edit-post/:_id', BlogController.getEditBlog)
router.put('/edit-post/:_id', verifyToken, BlogController.editBlog)
router.patch('/like/:blogId', verifyToken, BlogController.like)
router.patch('/unlike/:blogId', verifyToken, BlogController.unlike)
router.get('/:_id', BlogController.getBlog)
router.get('/:blogId/:authorId', BlogController.getBlogSameAuthor)
router.get('/', BlogController.getAllBlog)
router.post('/', verifyToken, BlogController.postNewBlog)
router.get('/', BlogController.getAllBlog)

module.exports = router
