const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const EpisodeSchema = new Schema(
    {
        title: String,
        courseId: { type: ObjectId, ref: 'courses' },
        lessons: [{ type: ObjectId, ref: 'lessons' }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('episodes', EpisodeSchema);
