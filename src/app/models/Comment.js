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
            enum: ['blogs', 'lessons'],
            required: true,
        },
        entity: { type: ObjectId, required: true, refPath: 'entityModel' },
        slug: { type: String, required: false },
    },
    {
        timestamps: true,
    }
);

// Auto-set slug before saving
CommentSchema.pre('save', async function (next) {
    console.log('this.entity', this.entity)
    if (this.entity && !this.slug) {
        const Entity = mongoose.model(this.entityModel);
        const entity = await Entity.findById(this.entity._id).select('slug').lean()
        if (entity) {
            this.slug = entity.slug;
        }
    }
    next();
});

CommentSchema.index({
    entity: 1,
    entityModel: 1,
    parentComment: 1,
    createdAt: -1,
});
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ 'reacts.reactedBy': 1 });

module.exports = mongoose.model('comments', CommentSchema);
