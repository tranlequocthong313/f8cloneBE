const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        postedBy: { type: ObjectId, ref: 'users', required: true },
        isCode: { type: Boolean, default: false },
        parentComment: { type: ObjectId, ref: 'comments', default: null },
        mentionUser: { type: ObjectId, ref: 'users' },
        reacts: [
            {
                reactedBy: { type: ObjectId, ref: 'users', required: true },
                emoji: {
                    type: String,
                    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
                    default: 'like',
                },
            },
        ],
        entityModel: {
            type: String,
            enum: ['blogs', 'courses'],
            required: true,
        },
        entity: { type: ObjectId, required: true, refPath: 'entityModel' },
    },
    {
        timestamps: true,
    }
);

CommentSchema.index({ entity: 1, entityModel: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ 'reacts.reactedBy': 1 });

module.exports = mongoose.model('comments', CommentSchema);
