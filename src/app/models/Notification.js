const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const NotificationSchema = new Schema(
    {
        sender: {
            type: ObjectId,
            ref: 'users',
            required: true,
        },
        receiver: {
            type: ObjectId,
            ref: 'users',
            required: true,
        },
        type: {
            type: String,
            enum: ['comments', 'like', 'follow', 'mention', 'system'],
            required: true,
        },
        entityId: {
            type: ObjectId, // points to blog, comment, etc.
            required: false, // optional in case of system notifications
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // includes createdAt, updatedAt
    }
);

module.exports = mongoose.model('notifications', NotificationSchema);
