const express = require('express')
const router = express.Router()
const BlogController = require('../app/controllers/BlogController')
const verifyToken = require('../middleware/verifyToken')

router.get('/draft', verifyToken, BlogController.getDraftBlog)
router.get('/:slug', BlogController.getBlog)
router.get('/tag/:tag', BlogController.getBlogTag)
router.get('/edit-blog/:slug', BlogController.getBlog)
router.put('/edit-blog/:slug', verifyToken, BlogController.editBlog)
router.put('/like', verifyToken, BlogController.like)
router.get('/:blogId/:authorId', BlogController.getBlogSameAuthor)
router.post('/add-popular', BlogController.addPopular)
router.get('/', BlogController.getAllBlog)
router.post('/', verifyToken, BlogController.postNewBlog)
router.get('/', BlogController.getAllBlog)

module.exports = router
