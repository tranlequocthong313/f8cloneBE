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
                Course.find({})
                    .select('_id slug image title studentCount role')
                    .lean(),
                Blog.find({ schedule: null, isPopular: true, isVerified: true })
                    .populate('postedBy')
                    .select(
                        '_id slug title titleDisplay image avatar author readingTime'
                    )
                    .lean()
                    .sort({ createdAt: -1 }),
                Video.find({
                    isPopular: true,
                })
                    .sort({ createdAt: -1 })
                    .lean(),
            ]);

            return res.json({
                courses: data[0],
                blogs: data[1],
                videos: data[2],
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
