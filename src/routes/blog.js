const express = require('express')
const router = express.Router()
const BlogController = require('../app/controllers/BlogController')
const verifyToken = require('../middleware/verifyToken')

router.get('/tag/:tag', BlogController.getBlogTag)
router.delete('/delete-blog/:blogId', verifyToken, BlogController.deleteBlog)
router.get('/edit-post/:_id', BlogController.getEditBlog)
router.put('/edit-post/:_id', verifyToken, BlogController.editBlog)
router.patch('/like', verifyToken, BlogController.like)
router.put('/comment', verifyToken, BlogController.comment)
router.put('/comment/reply', verifyToken, BlogController.replyComment)
router.get(
  '/comment/get-reply/:blogId/:commentId',
  verifyToken,
  BlogController.getReplyComment
)
router.put('/comment/react', verifyToken, BlogController.reactComment)
router.put('/comment/edit', verifyToken, BlogController.editComment)
router.get('/:slug', BlogController.getBlog)
router.get('/:blogId/:authorId', BlogController.getBlogSameAuthor)
router.get('/', BlogController.getAllBlog)
router.post('/', verifyToken, BlogController.postNewBlog)
router.get('/', BlogController.getAllBlog)

module.exports = router
