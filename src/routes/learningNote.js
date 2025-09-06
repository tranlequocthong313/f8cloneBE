const express = require('express');
const router = express.Router();
const LearningNoteController = require('../app/controllers/LearningNoteController');
const verifyToken = require('../middleware/verifyToken');

router.put('/:id', verifyToken, LearningNoteController.editNote);
router.delete('/:id', verifyToken, LearningNoteController.deleteNote);
router.post('/', verifyToken, LearningNoteController.createNote);
router.get('/', verifyToken, LearningNoteController.getNotes);

module.exports = router;
