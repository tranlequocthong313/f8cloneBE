const mongoose = require('mongoose');
const { NotificationTypes } = require('./enum');
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
            required: false,
        },
        type: {
            type: String,
            enum: Object.values(NotificationTypes),
            required: true,
        },
        subject: {
            type: ObjectId,
            required: false,
            refPath: 'subjectModel',
        },
        subjectModel: {
            type: String,
            required: false,
            enum: ['blogs', 'comments', 'lessons'],
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('notifications', NotificationSchema);
