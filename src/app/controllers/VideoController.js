const Video = require('../models/Video')

class VideoController {
  // @route POST /video/create
  // @desc Create video by youtube videoId
  // @access Private
  async createVideo(req, res) {
    try {
      const video = await Video.create(req.body)
      return res.json({
        success: true,
        message: 'Create Successfully!',
        video,
      })
    } catch (error) {
      console.log(error.message)
      return res.json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }

  // @route POST /video/delete-soft
  // @desc Delete soft video by youtube videoId
  // @access Private
  async deleteSoft(req, res) {
    try {
      console.log(req.body.videoId)
      await Video.delete({ _id: { $in: req.body.videoId } })
      const video = await Video.find().sort({ createdAt: -1 })

      return res.json({
        success: true,
        message: 'Create Successfully!',
        video,
      })
    } catch (error) {
      console.log(error.message)
      return res.json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }

  // @route POST /video/add-popular
  // @desc Add video to popular video
  // @access Private
  async addPopular(req, res) {
    try {
      const video = await Video.findOneAndUpdate(
        { _id: req.body.videoId },
        {
          $set: { isPopular: !req.body.isPopular },
        },
      ).sort({ createdAt: -1 })

      return res.json({
        success: true,
        message: 'Create Successfully!',
        video,
      })
    } catch (error) {
      console.log(error.message)
      return res.json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }
}

module.exports = new VideoController()
