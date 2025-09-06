const { Schema, default: mongoose } = require('mongoose');
const { ObjectId } = mongoose.Types;

const LearningNote = new Schema(
    {
        time: { type: Number, required: true },
        content: { type: String, required: true },
        courseId: { type: ObjectId, ref: 'courses' },
        episodeId: { type: ObjectId, ref: 'episodes' },
        lessonId: { type: ObjectId, ref: 'lessons' },
    },
    {
        timestamps: true,
    }
);

LearningNote.virtual('course', {
    ref: 'courses',
    localField: 'courseId',
    foreignField: '_id',
    justOne: true,
});

LearningNote.virtual('episode', {
    ref: 'episodes',
    localField: 'episodeId',
    foreignField: '_id',
    justOne: true,
});

LearningNote.virtual('lesson', {
    ref: 'lessons',
    localField: 'lessonId',
    foreignField: '_id',
    justOne: true,
});

LearningNote.index({
    courseId: 1,
    episodeId: 1,
    lessonId: 1,
    createdAt: -1,
});

module.exports = mongoose.model('learning_note', LearningNote);
