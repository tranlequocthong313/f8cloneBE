const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new Schema(
    {
        content: {type: String,  required: true},
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
        type: {
            type: String,
            enum: ['blog', 'course'],
            required: true,
        },
        entityId: { type: ObjectId, required: true },
    },
    {
        timestamps: true,
    }
);

CommentSchema.index({ entityId: 1, type: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ 'reacts.reactedBy': 1 });

module.exports = mongoose.model('comments', CommentSchema);
