const Blog = require('../models/Blog');
const User = require('../models/User');
const schedule = require('node-schedule');
const cache = require('../../utils/Cache');

class BlogController {
  // @route POST /new-post
  // @desc Post new blog
  // @access Private
  async postNewBlog(req, res) {
    try {
      const blog = await Blog.create({
        ...req.body,
        postedBy: req._id,
      });

      const isScheduleBlog = req.body.schedule;
      if (isScheduleBlog) {
        schedule.scheduleJob(
          req.body.schedule,
          async () =>
            await Blog.updateOne(
              { _id: blog._id },
              {
                schedule: null,
              }
            )
        );
      }

      return res.json({
        success: true,
        message: 'Post blog successfully!',
        blog,
      });
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Post blog failed!',
      });
    }
  }

  // @route GET /blog
  // @desc Get all blog
  // @access Public
  async getAllBlog(req, res) {
    try {
      const allBlog = await Blog.find({
        schedule: null,
        isVerified: true,
        isPosted: true,
      })
        .populate('postedBy')
        .sort({ createdAt: -1 });

      return res.json(allBlog);
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Get blog failed!',
      });
    }
  }

  // @route GET /blog/:slug || /blog/edit-blog/:slug
  // @desc Get blog by slug
  // @access Public
  async getBlog(req, res) {
    try {
      const blogData = await Promise.all([
        Blog.findOne({
          slug: req.params.slug,
          schedule: null,
          isPosted: true,
        })
          .populate('postedBy')
          .populate('comments.postedBy'),
        Blog.find({ isPopular: true, isPosted: true }).populate(
          'postedBy',
          '_id fullName bio photoURL'
        ),
      ]);

      return res.json({
        blogSlug: blogData[0],
        blogHighlight: blogData[1],
      });
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Get blog failed!',
      });
    }
  }

  // @route GET /blog/tag/:tag
  // @desc Get blog by tag
  // @access Public
  async getBlogTag(req, res) {
    try {
      const blogTagData = await Blog.find({
        schedule: null,
        isVerified: true,
        isPosted: true,
        tags: req.params.tag,
      })
        .populate('postedBy')
        .sort({ createdAt: -1 });

      return res.json(blogTagData);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route PUT /blog/edit-blog/:slug
  // @desc Edit blog
  // @access Private
  async editBlog(req, res) {
    try {
      await Blog.updateOne(
        { slug: req.params.slug, postedBy: req._id },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
          },
        }
      );

      return res.json({
        success: true,
        message: 'Edit blog successfully!',
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: 'Edit blog failed!',
      });
    }
  }

  // @route GET /blog/same-author/:id
  // @desc Get bog same author
  // @access Public
  async getBlogSameAuthor(req, res) {
    try {
      const blogSameAuthor = await Blog.find({
        postedBy: req.params.authorId,
        _id: { $ne: req.params.blogId },
        schedule: null,
        isPosted: true,
      }).select('slug titleDisplay');

      return res.json(blogSameAuthor);
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Get blog failed!',
      });
    }
  }

  // @route PUT /blog/like
  // @desc Like blog
  // @access Private
  async like(req, res) {
    try {
      const liked = await Blog.where('_id')
        .equals(req.body.blogId)
        .select('likes');

      const isLikedBlog = liked[0].likes.includes(req._id);
      if (isLikedBlog) {
        const likes = await Blog.findByIdAndUpdate(
          req.body.blogId,
          {
            $pull: { likes: req._id },
          },
          { new: true }
        ).select('likes slug postedBy');

        return res.json(likes);
      }
      const likes = await Blog.findByIdAndUpdate(
        req.body.blogId,
        {
          $push: { likes: { $each: [req._id], $position: 0 } },
        },
        { new: true }
      ).select('likes slug postedBy');

      return res.json(likes);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route PUT /comment
  // @desc Comment blog
  // @access Private
  async comment(req, res) {
    try {
      const commentData = {
        content: req.body.content,
        postedBy: req._id,
        isCode: req.body.isCode,
      };

      const comments = await Blog.findOneAndUpdate(
        {
          _id: req.body.blogId,
        },
        {
          $push: { comments: { $each: [commentData], $position: 0 } },
        },
        {
          new: true,
        }
      )
        .select('comments')
        .populate('comments.postedBy', '_id fullName photoURL');

      console.log(commentData, req.body.blogId, comments);

      return res.json(comments);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route GET /get-reply
  // @desc Get reply comment
  // @access Private
  async getReplyComment(req, res) {
    try {
      const replyComment = await Blog.findOne({
        $and: [
          { _id: req.body.blogId },
          { 'comments._id': req.body.commentId },
        ],
      })
        .select('comments.replies comments._id')
        .populate('comments.replies.postedBy', '_id fullName photoURL');

      console.log(replyComment);
      return res.json(replyComment);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route PUT /reply
  // @desc Reply comment
  // @access Private
  async replyComment(req, res) {
    try {
      const commentData = {
        content: req.body.content,
        postedBy: req._id,
        isCode: req.body.isCode,
      };

      const comments = await Blog.findOneAndUpdate(
        {
          $and: [
            { _id: req.body.blogId },
            { 'comments._id': req.body.commentId },
          ],
        },
        {
          $push: {
            'comments.$.replies': { $each: [commentData] },
          },
        },
        {
          new: true,
        }
      )
        .select('comments.replies comments._id')
        .populate('comments.replies.postedBy', '_id fullName photoURL');

      console.log(comments);

      return res.json(comments);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route PUT /comment/react
  // @desc React comment
  // @access Private
  async reactComment(req, res) {
    try {
      const reactData = {
        reactedBy: req._id,
        emoji: req.body.emoji,
      };

      const comments = await Blog.findOneAndUpdate(
        { 'comments._id': req.body.commentId },
        {
          $push: {
            'comments.$.reacts': reactData,
          },
        },
        {
          new: true,
        }
      )
        .select('comments')
        .populate('comments.postedBy', '_id fullName photoURL')
        .populate('comments.reacts.reactedBy', '_id fullName photoURL');

      return res.json(comments);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route PUT blog/comment/edit
  // @desc Edit comment
  // @access Private
  async editComment(req, res) {
    try {
      const comments = await Blog.findOneAndUpdate(
        { 'comments._id': req.body.commentId },
        {
          $set: {
            'comments.$.content': req.body.content,
            'comments.$.isCode': req.body.isCode,
          },
        },
        { new: true }
      )
        .select('comments')
        .populate('comments.postedBy', '_id fullName photoURL');

      console.log(comments);

      return res.json(comments);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route PUT blog/comment/delete
  // @desc Delete comment
  // @access Private
  async deleteComment(req, res) {
    console.log(req.body.commentId);

    try {
      const comments = await Blog.findOneAndUpdate(
        { 'comments._id': req.body.commentId },
        { $pull: { comments: { _id: req.body.commentId } } },
        { new: true }
      )
        .select('comments')
        .populate('comments.postedBy', '_id fullName photoURL');

      console.log('Comments: ', comments);

      return res.json(comments);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route POST /blog/add-popular
  // @desc Add blog to popular blog
  // @access Private
  async addPopular(req, res) {
    try {
      const blog = await Blog.findOneAndUpdate(
        { _id: req.body.blogId },
        {
          $set: { isPopular: !req.body.isPopular },
        }
      ).sort({ createdAt: -1 });

      return res.json({
        success: true,
        message: 'Create Successfully!',
        blog,
      });
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Create Failed!',
      });
    }
  }
}

module.exports = new BlogController();
