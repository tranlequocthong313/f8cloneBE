const Video = require('../models/Video')

class VideoController {
  // @route POST /video/create
  // @desc Create video by youtube videoId
  // @access Private
  async createVideo(req, res, next) {
    try {
      const video = await Video.create(req.body)
      return res.json({
        success: true,
        message: 'Create Successfully!',
        video,
      })
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }

  // @route POST /video/delete-soft
  // @desc Delete soft video by youtube videoId
  // @access Private
  async deleteSoft(req, res, next) {
    try {
      const { videoId } = req.body

      await Video.delete({ _id: { $in: videoId } })
      const video = await Video.find().sort({ createdAt: -1 })

      return res.json({
        success: true,
        message: 'Create Successfully!',
        video,
      })
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }

  // @route POST /video/add-popular
  // @desc Add video to popular video
  // @access Private
  async addPopular(req, res, next) {
    try {
      const { videoId, isPopular } = req.body

      const video = await Video.findOneAndUpdate(
        { _id: videoId },
        {
          $set: { isPopular: !isPopular },
        }
      ).sort({ createdAt: -1 })

      return res.json({
        success: true,
        message: 'Create Successfully!',
        video,
      })
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Create Failed!',
      })
    }
  }
}

module.exports = new VideoController()
