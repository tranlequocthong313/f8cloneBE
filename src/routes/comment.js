const express = require('express');
const router = express.Router();
const CommentController = require('../app/controllers/CommentController');
const verifyToken = require('../middleware/verifyToken');

router.get('/:id', CommentController.getRepliedComments);
router.put('/:id/react', verifyToken, CommentController.reactComment);
router.put('/:id', verifyToken, CommentController.editComment);
router.delete('/:id', verifyToken, CommentController.deleteComment);
router.post('/', verifyToken, CommentController.postComment);
router.get('/', CommentController.getComments);

module.exports = router;
