const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userLessonProgressSchema = new Schema({
    lessonId: { type: ObjectId },
    status: {
        type: String,
        enum: ['locked', 'in-progress', 'completed'],
        default: 'locked',
    },
    startedAt: Date,
    completedAt: Date,
});

const LearnProgressSchema = new Schema({
    userId: { type: ObjectId, ref: 'users' },
    courseId: { type: ObjectId, ref: 'courses' },
    lessons: [userLessonProgressSchema],
});

module.exports = mongoose.model('learn_progress', LearnProgressSchema);
