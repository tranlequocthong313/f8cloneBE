const Blog = require('../models/Blog');
const Course = require('../models/Course');
const Video = require('../models/Video');
const Lesson = require('../models/Lesson');
const Episode = require('../models/Episode');

class AdminController {
    // @route POST /courses/create
    // @desc Create course
    // @access Private
    async createCourse(req, res) {
        const session = await Course.startSession();
        session.startTransaction();

        try {
            const {
                title,
                description,
                videoId,
                image,
                level,
                topics,
                requirement,
                episodes,
            } = req.body;

            const course = await Course.create(
                [
                    {
                        title,
                        description,
                        videoId,
                        image,
                        level,
                        topics,
                        requirement,
                        search: title?.toLowerCase(),
                        postedBy: req._id,
                    },
                ],
                { session }
            );

            const courseDoc = course[0];
            const episodeIds = [];

            for (const ep of episodes || []) {
                const lessonIds = [];

                for (const lesson of ep.lessons || []) {
                    const lessonDoc = await Lesson.create(
                        [
                            {
                                title: lesson.title,
                                time: lesson.time,
                                videoId: lesson.videoId,
                                episodeId: null,
                                courseId: courseDoc._id,
                            },
                        ],
                        { session }
                    );

                    lessonIds.push(lessonDoc[0]._id);
                }

                const episodeDoc = await Episode.create(
                    [
                        {
                            title: ep.title,
                            courseId: courseDoc._id,
                            lessons: lessonIds,
                        },
                    ],
                    { session }
                );

                episodeIds.push(episodeDoc[0]._id);

                await Lesson.updateMany(
                    { _id: { $in: lessonIds } },
                    { $set: { episodeId: episodeDoc[0]._id } },
                    { session }
                );
            }

            courseDoc.episodes = episodeIds;
            await courseDoc.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.json({
                success: true,
                message: 'Create Successfully!',
                course: courseDoc,
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error);
            return res.json({
                success: false,
                message: 'Create Failed!',
            });
        }
    }

    // @route POST /blog/verify
    // @desc Verify blog
    // @access Private
    async verifyBlog(req, res) {
        try {
            req.body.isVerified
                ? await Blog.updateOne(
                      { _id: req.body.blogId },
                      { isVerified: true }
                  )
                : await Blog.delete({ _id: req.body.blogId });

            return res.json({
                success: true,
                message: 'Successfully!',
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Internal Error!',
            });
        }
    }

    // @route POST /blog/delete-soft
    // @desc Delete soft blog by youtube blogId
    // @access Private
    async deleteBlogSoft(req, res) {
        try {
            await Blog.delete({ _id: { $in: req.body.blogId } });
            const blog = await Blog.find().sort({ createdAt: -1 });

            return res.json({
                success: true,
                message: 'Delete Successfully!',
                blog,
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Delete Failed!',
            });
        }
    }

    // @route POST /blog/add-popular
    // @desc Add blog to popular blog
    // @access Private
    async addBlogPopular(req, res) {
        try {
            const blog = await Blog.findOneAndUpdate(
                { _id: req.body.blogId },
                {
                    $set: { isPopular: !req.body.isPopular },
                }
            ).sort({ createdAt: -1 });

            return res.json({
                success: true,
                message: 'Add Successfully!',
                blog,
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Add Failed!',
            });
        }
    }

    // @route POST /video/create
    // @desc Create video by youtube videoId
    // @access Private
    async createVideo(req, res) {
        try {
            const video = await Video.create(req.body);
            return res.json({
                success: true,
                message: 'Create Successfully!',
                video,
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Create Failed!',
            });
        }
    }

    // @route POST /video/delete-soft
    // @desc Delete soft video by youtube videoId
    // @access Private
    async deleteVideoSoft(req, res) {
        try {
            await Video.delete({ _id: { $in: req.body.videoId } });
            const video = await Video.find().sort({ createdAt: -1 });

            return res.json({
                success: true,
                message: 'Delete Successfully!',
                video,
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Delete Failed!',
            });
        }
    }

    // @route POST /video/add-popular
    // @desc Add video to popular video
    // @access Private
    async addVideoPopular(req, res) {
        try {
            const video = await Video.findOneAndUpdate(
                { _id: req.body.videoId },
                {
                    $set: { isPopular: !req.body.isPopular },
                }
            ).sort({ createdAt: -1 });

            return res.json({
                success: true,
                message: 'Add Popular Successfully!',
                video,
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Add Popular Failed!',
            });
        }
    }

    // @route GET /
    // @desc Get data
    // @access Private
    async getData(req, res) {
        try {
            const data = await Promise.all([
                Course.find(),
                Blog.find({ schedule: null, isPosted: true }).populate(
                    'postedBy'
                ),
                Video.find().sort({ createdAt: -1 }),
            ]);

            return res.json({
                course: data[0],
                blogs: data[1],
                videos: data[2],
            });
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Internal error!',
            };
        }
    }
}

module.exports = new AdminController();
