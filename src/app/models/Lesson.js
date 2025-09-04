const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const LessonSchema = new Schema(
    {
        title: String,
        time: String,
        videoId: String,
        courseId: { type: ObjectId, ref: 'courses' },
        episodeId: { type: ObjectId, ref: 'episodes' },
        courseSlug: { type: String },
    },
    {
        timestamps: true,
    }
);

LessonSchema.virtual('course', {
    ref: 'courses',
    localField: 'courseId',
    foreignField: '_id',
    justOne: true,
});

// Auto-set courseSlug before saving
LessonSchema.pre('save', async function (next) {
    if (this.courseId && !this.courseSlug) {
        const Course = mongoose.model('courses');
        const course = await Course.findById(this.courseId).select('slug');
        if (course) {
            this.courseSlug = course.slug;
        }
    }
    next();
});

// Also update slug if courseId changes
LessonSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.courseId) {
        const Course = mongoose.model('courses');
        const course = await Course.findById(update.courseId).select('slug');
        if (course) {
            update.courseSlug = course.slug;
            this.setUpdate(update);
        }
    }
    next();
});

LessonSchema.set('toObject', { virtuals: true });
LessonSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('lessons', LessonSchema);
