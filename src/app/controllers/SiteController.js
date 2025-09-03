const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Video = require('../models/Video');
const cache = require('../../utils/Cache');

class SiteController {
    // @route GET /
    // @desc Get data
    // @access Public
    async index(req, res) {
        try {
            const data = await Promise.all([
                Course.find({ role: { $in: ['FE', 'Fullstack'] } }).select(
                    '_id slug image title studentCount'
                ),

                Course.find({ role: { $in: ['BE', 'Fullstack'] } }).select(
                    '_id slug image title studentCount'
                ),
                Blog.find({ schedule: null, isPopular: true, isVerified: true })
                    .populate('postedBy')
                    .select(
                        '_id slug title titleDisplay image avatar author readingTime'
                    ),
                Video.find({
                    isPopular: true,
                }).sort({ createdAt: -1 }),
            ]);

            return res.json({
                courseFE: data[0],
                courseBE: data[1],
                blogs: data[2],
                videos: data[3],
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}

module.exports = new SiteController();
