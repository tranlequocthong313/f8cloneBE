const express = require('express')
const router = express.Router()
const helpController = require('../app/controllers/HelpController')
const verifyToken = require('../middleware/verifyToken')

router.get('/my-post', verifyToken, helpController.getMyPost)
router.post('/contact', helpController.contact)
router.post('/new-job', verifyToken, helpController.newJob)
router.get('/get-job', helpController.getJob)
router.get('/:text', helpController.search)
router.post('/setting/fullName', verifyToken, helpController.changeFullName)
router.post('/setting/avatar', verifyToken, helpController.changeAvatar)
router.post('/setting/bio', verifyToken, helpController.changeBio)
router.post('/setting/social', verifyToken, helpController.changeSocial)

module.exports = router
