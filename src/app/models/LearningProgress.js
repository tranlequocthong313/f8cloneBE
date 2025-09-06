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

const LearningProgressSchema = new Schema({
    userId: { type: ObjectId, ref: 'users' },
    courseId: { type: ObjectId, ref: 'courses' },
    lessons: [userLessonProgressSchema],
});

LearningProgressSchema.index({
    userId: 1,
    courseId: 1,
});

module.exports = mongoose.model('learning_progress', LearningProgressSchema);
