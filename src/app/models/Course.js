const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const { ObjectId } = mongoose.Types;

mongoose.plugin(slug);

const CourseSchema = new Schema(
    {
        title: { type: String, required: true },
        search: { type: String, required: true },
        description: {
            type: String,
            required: true,
        },
        videoId: {
            type: String,
            required: true,
        },
        image: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advance'],
            default: 'beginner',
            required: true,
        },
        slug: { type: String, slug: 'title', unique: true, slugPaddingSize: 4 },
        studentCount: { type: Number, default: 0 },
        topics: { type: Array, required: true },
        requirement: [String],
        episodes: [{ type: ObjectId, ref: 'episodes' }],
        role: String,
    },
    {
        timestamps: true,
    }
);

CourseSchema.plugin(mongooseDelete, {
    overrideMethods: ['find', 'findOne'],
    deletedAt: true,
});

module.exports = mongoose.model('courses', CourseSchema);
