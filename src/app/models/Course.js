const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const lessonSchema = new Schema(
    {
        lessonId: String,
        title: String,
        time: String,
        videoId: String,
    },
    {
        timestamps: true,
    }
);

const episodeSchema = new Schema(
    {
        episodeId: String,
        title: String,
        lessons: [lessonSchema],
    },
    {
        timestamps: true,
    }
);

const commentSchema = new Schema(
    {
        content: String,
        postedBy: { type: ObjectId, ref: 'users' },
        createdAt: { type: Date, default: () => Date.now(), immutable: true },
        isCode: { type: Boolean, default: false },
        reacts: [
            {
                reactedBy: { type: ObjectId, ref: 'users' },
                emoji: String,
            },
        ],
        replies: [
            {
                content: String,
                postedBy: { type: ObjectId, ref: 'users' },
                createdAt: {
                    type: Date,
                    default: () => Date.now(),
                    immutable: true,
                },
                isCode: { type: Boolean, default: false },
                reacts: [
                    {
                        reactedBy: { type: ObjectId, ref: 'users' },
                        emoji: String,
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

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
        comments: [commentSchema],
        studentCount: { type: Number, default: 0 },
        topics: { type: Array, required: true },
        requirement: [String],
        episode: [episodeSchema],
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
