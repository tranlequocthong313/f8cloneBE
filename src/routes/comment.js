const express = require('express')
const router = express.Router()
const commentController = require('../app/controllers/CommentController')
const verifyToken = require('../middleware/verifyToken')

router.get('/:postId', commentController.getCommentsByPostId)
router.patch('/like/:commentId', verifyToken, commentController.likeComment)
router.patch('/unlike/:commentId', verifyToken, commentController.unlikeComment)
router.delete('/:commentId', verifyToken, commentController.deleteComment)
router.put('/:commentId', verifyToken, commentController.editComment)
router.post('/reply', verifyToken, commentController.createReplyComment)
router.post('/', verifyToken, commentController.createComment)

module.exports = router
