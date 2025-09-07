const Course = require('../models/Course');
const Episode = require('../models/Episode');
const LearningNote = require('../models/LearningNote');
const Lesson = require('../models/Lesson');

class LearningNoteController {
    // @route GET /notes?courseId=xxx&episodeId=yyy&sort=(-1|1)
    // @desc Get notes
    // @access Private
    async getNotes(req, res) {
        try {
            const { courseId, episodeId = null, sort = -1 } = req.query;

            if (!courseId) {
                return res.status(400).json({
                    message: 'courseId query param is required',
                    success: false,
                });
            }

            const filter = { courseId };
            if (episodeId) {
                filter.episodeId = episodeId;
            }

            const notes = await LearningNote.find(filter)
                .populate([
                    {
                        path: 'episode',
                        select: 'title',
                    },
                    {
                        path: 'lesson',
                        select: 'title',
                    },
                ])
                .sort({ createdAt: isNaN(sort) ? -1 : sort })
                .lean();

            return res.json({
                message: 'Get learning notes successfully!',
                success: true,
                notes,
            });
        } catch (error) {
            console.log(
                '🚀 ~ LearningNoteController ~ getNotes ~ error:',
                error
            );
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }

    // @route POST /notes
    // @desc Create note
    // @access Private
    async createNote(req, res) {
        try {
            const { courseId, episodeId, lessonId, time, content } = req.body;

            if (!courseId || !episodeId || !lessonId || !time || !content) {
                return res.status(400).json({
                    message: 'Bad request',
                    success: false,
                });
            }

            const c = await Course.findById(courseId).lean();
            const e = await Episode.findById(episodeId).lean();
            const l = await Lesson.findById(lessonId).lean();

            if (!c || !e || !l) {
                return res.status(404).json({
                    message: 'Not found course, episode or lesson',
                    success: false,
                });
            }

            const note = await LearningNote.create(req.body);

            return res.json({
                message: 'Create learning note successfully!',
                success: true,
                note,
            });
        } catch (error) {
            console.log(
                '🚀 ~ LearningNoteController ~ createNote ~ error:',
                error
            );
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }

    // @route PUT /notes/:id
    // @desc Edit note
    // @access Private
    async editNote(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            console.log("🚀 ~ LearningNoteController ~ editNote ~ id:", id, content)

            if (!content || !id) {
                return res.status(400).json({
                    message: 'Bad request',
                    success: false,
                });
            }

            const note = await LearningNote.updateOne({ _id: id }, req.body);

            return res.json({
                message: 'Edit learning note successfully!',
                success: true,
                note,
            });
        } catch (error) {
            console.log(
                '🚀 ~ LearningNoteController ~ editNote ~ error:',
                error
            );
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }

    // @route DELETE /notes/:id
    // @desc Delete note
    // @access Private
    async deleteNote(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    message: 'Bad request',
                    success: false,
                });
            }

            const result = await LearningNote.deleteOne({ _id: id });

            return res.json({
                message: 'Delete learning note successfully!',
                success: true,
                result,
            });
        } catch (error) {
            console.log(
                '🚀 ~ LearningNoteController ~ deleteNote ~ error:',
                error
            );
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }
}

module.exports = new LearningNoteController();
