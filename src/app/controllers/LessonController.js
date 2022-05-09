const Lesson = require('../models/Lesson')
const createError = require('http-errors')
const Course = require('../models/Course')

class LessonController {
  // @route POST /create-lesson
  // @desc Create lesson
  // @access Private
  async createLesson(req, res, next) {
    try {
      const { courseId } = req.params
      const { episodeParent } = req.body

      const lesson = await Lesson.create(req.body)

      const episodes = await Course.findOneAndUpdate(
        { _id: courseId, 'episodes._id': episodeParent },
        {
          $push: { 'episodes.$.lessons': lesson._id },
        },
        { new: true }
      )
        .populate('episodes.lessons')
        .select('episodes -_id')

      return res.status(200).json(episodes)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route PUT /edit-lesson/:courseId/:lessonId
  // @desc Edit lesson
  // @access Private
  async editLesson(req, res, next) {
    try {
      const { courseId, prevEpisodeId, lessonId } = req.params
      const { episodeParent } = req.body

      await Lesson.findByIdAndUpdate(lessonId, {
        $set: req.body,
      })

      let episodes
      if (prevEpisodeId !== episodeParent) {
        await Course.findOneAndUpdate(
          { _id: courseId, 'episodes._id': prevEpisodeId },
          {
            $pull: { 'episodes.$.lessons': lessonId },
          },
          { new: true }
        )

        episodes = await Course.findOneAndUpdate(
          { _id: courseId, 'episodes._id': episodeParent },
          {
            $push: { 'episodes.$.lessons': lessonId },
          },
          { new: true }
        )
          .populate('episodes.lessons')
          .select('episodes -_id')
      } else {
        episodes = await Course.findById(courseId)
          .populate('episodes.lessons')
          .select('episodes -_id')
      }

      return res.status(200).json(episodes)
    } catch (error) {
      console.log(error.message)
      next(createError.InternalServerError())
    }
  }
  async deleteLesson(req, res, next) {}
}

module.exports = new LessonController()
