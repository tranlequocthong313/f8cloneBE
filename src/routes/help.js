const express = require('express')
const router = express.Router()
const helpController = require('../app/controllers/HelpController')
const verifyToken = require('../middleware/verifyToken')

router.post('/contact', helpController.contact)
router.post('/new-job', verifyToken, helpController.newJob)
router.get('/get-job', helpController.getJob)
router.patch('/setting/fullName', verifyToken, helpController.changeFullName)
router.patch('/setting/avatar', verifyToken, helpController.changeAvatar)
router.patch('/setting/bio', verifyToken, helpController.changeBio)
router.patch('/setting/social', verifyToken, helpController.changeSocial)
router.get('/my-post', verifyToken, helpController.getMyPost)
router.get('/:text', helpController.search)

module.exports = router
