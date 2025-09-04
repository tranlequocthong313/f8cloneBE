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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('lessons', LessonSchema);
