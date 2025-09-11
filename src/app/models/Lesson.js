const mongoose = require('mongoose');
const Course = require('./Course');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const LessonSchema = new Schema(
    {
        title: String,
        time: String,
        videoId: String,
        courseId: { type: ObjectId, ref: 'courses' },
        episodeId: { type: ObjectId, ref: 'episodes' },
        slug: { type: String },
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

// Auto-set slug before saving
LessonSchema.pre('save', async function (next) {
    if (this.courseId && !this.slug) {
        const session = this.$session();
        const course = await Course.findById(this.courseId, null, { session })
            .select('slug')
            .lean();

        if (course) {
            this.slug = course.slug;
        }
    }
    next();
});

LessonSchema.set('toObject', { virtuals: true });
LessonSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('lessons', LessonSchema);
