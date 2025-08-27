const express = require('express');
const router = express.Router();
const HelpController = require('../app/controllers/HelpController');
const verifyToken = require('../middleware/verifyToken');

router.get('/my-post', verifyToken, HelpController.getMyPost);
router.post('/contact', HelpController.contact);
router.post('/new-job', verifyToken, HelpController.newJob);
router.get('/get-job', HelpController.getJob);
router.get('/:text', HelpController.search);
router.post('/setting/fullName', verifyToken, HelpController.changeFullName);
router.post('/setting/avatar', verifyToken, HelpController.changeAvatar);
router.post('/setting/bio', verifyToken, HelpController.changeBio);
router.post('/setting/social', verifyToken, HelpController.changeSocial);

module.exports = router;
