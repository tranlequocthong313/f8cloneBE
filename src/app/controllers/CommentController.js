const Comment = require('../models/Comment');
const { NotificationTypes } = require('../models/enum');
const Notification = require('../models/Notification');
const { ObjectId } = require('mongoose').Types;

class CommentController {
    // @route GET /comment?entityId=xxx&type=yyy
    // @desc Get comments
    // @access Public
    async getComments(req, res) {
        try {
            const { entityId, type } = req.query;

            if (!entityId || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing entityId or type in query params',
                });
            }

            const comments = await Comment.aggregate([
                {
                    $match: {
                        entity: new ObjectId(entityId),
                        entityModel: type,
                        parentComment: null,
                    },
                },
                {
                    $lookup: {
                        from: 'comments',
                        let: { parentId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$parentComment', '$$parentId'],
                                    },
                                },
                            },
                            {
                                $count: 'count',
                            },
                        ],
                        as: 'replyCount',
                    },
                },
                {
                    $addFields: {
                        totalReplies: {
                            $ifNull: [
                                { $arrayElemAt: ['$replyCount.count', 0] },
                                0,
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'postedBy',
                        foreignField: '_id',
                        as: 'postedBy',
                    },
                },
                {
                    $unwind: {
                        path: '$postedBy',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                { $sort: { createdAt: -1 } },
            ]);

            return res.json({
                success: true,
                message: 'Get comments successfully!',
                comments,
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    // @route GET /comment/:id
    // @desc Get replied comments
    // @access Public
    async getRepliedComments(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'Missing id',
                });
            }

            const comments = await Comment.find({
                parentComment: id,
            }).populate('postedBy');

            return res.json({
                success: true,
                message: 'Get replied comments successfully!',
                comments,
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    // @route POST /comment
    // @desc Post new comment
    // @access Private
    async postComment(req, res) {
        try {
            const comment = new Comment({
                ...req.body,
                entityModel: req.body.type,
                entity: req.body.entityId,
                postedBy: req._id,
            });

            await comment.save();
            await comment.populate(['postedBy', 'entity']);

            console.log('enitty', comment);
            req.io.emit('post-comment', comment);
            req.io.emit(
                `${comment.entityModel}-post-comment`,
                comment.entity._id
            );

            if (req._id !== comment.entity.postedBy) {
                const notification = new Notification({
                    sender: req._id,
                    receiver: comment.entity.postedBy,
                    type: NotificationTypes.COMMENT_BLOG,
                    entity: comment.entity._id,
                    entityModel: comment.entityModel,
                });

                await notification.save();
                await notification.populate(['sender', 'entity']);

                req.io.emit('notification', notification);
            }

            return res.json({
                success: true,
                message: 'Post comment successfully!',
                comment,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    // @route PUT /comment/:id
    // @desc Edit comment
    // @access Private
    async editComment(req, res) {
        try {
            const comment = await Comment.findOneAndUpdate(
                {
                    _id: req.params.id,
                    postedBy: req._id,
                },
                {
                    $set: req.body,
                },
                {
                    new: true,
                }
            ).populate('postedBy');

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found',
                });
            }

            req.io.emit('edit-comment', comment);

            return res.json({
                success: true,
                message: 'Edit comment successfully!',
                comment,
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    // @route DELETE /comment/:id
    // @desc Delete comment
    // @access Private
    async deleteComment(req, res) {
        try {
            const comment = await Comment.findOne({
                _id: req.params.id,
                postedBy: req._id,
            });
            const result = await Comment.deleteOne({
                _id: req.params.id,
                postedBy: req._id,
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found',
                });
            }

            const repliedCommentResult = await Comment.deleteMany({
                parentComment: req.params.id,
            });

            req.io.emit('delete-comment', {
                commentId: req.params.id,
                parentCommentId: comment.parentComment,
            });
            req.io.emit(`${comment.entityModel}-delete-comment`, {
                entityId: comment.entity,
                deletedCount:
                    repliedCommentResult.deletedCount + result.deletedCount,
            });

            return res.status(204).json({
                success: true,
                message: 'Delete comment successfully!',
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    // @route PUT /comment/:id/react
    // @desc React comment
    // @access Private
    async reactComment(req, res) {
        try {
            const userId = req._id;
            const { emoji } = req.body;

            const comment = await Comment.findById(req.params.id).populate(
                'postedBy'
            );

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found',
                });
            }

            const existing = comment.reacts.find(
                (r) => r.reactedBy.toString() === userId
            );

            if (existing) {
                if (existing.emoji === emoji) {
                    comment.reacts = comment.reacts.filter(
                        (r) => r.reactedBy.toString() !== userId
                    );
                } else {
                    existing.emoji = emoji;
                }
            } else {
                comment.reacts.push({
                    reactedBy: userId,
                    emoji,
                });
            }

            await comment.save();

            req.io.emit('edit-comment', comment);

            return res.json({
                success: true,
                message: 'React comment successfully!',
                comment,
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}

module.exports = new CommentController();
