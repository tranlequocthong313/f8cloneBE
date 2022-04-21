const Job = require('../models/Job');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Video = require('../models/Video');
const User = require('../models/User');
const Contact = require('../models/Contact');

class HelpController {
  // @route POST /setting/fullName
  // @desc Change fullName
  // @access Private
  async changeFullName(req, res) {
    try {
      const fullName = await User.findOneAndUpdate(
        { _id: req._id },
        {
          $set: { fullName: req.body.fullName },
        },
        { new: true }
      ).select('fullName');

      return res.json(fullName);
    } catch (error) {
      console.log(error);
    }
  }

  // @route POST /setting/avatar
  // @desc Change avatar
  // @access Private
  async changeAvatar(req, res) {
    try {
      const avatar = await User.findOneAndUpdate(
        { _id: req._id },
        {
          $set: { photoURL: req.body.photoURL },
        },
        { new: true }
      ).select('photoURL');

      return res.json(avatar);
    } catch (error) {
      console.log(error);
    }
  }

  // @route POST /setting/bio
  // @desc Change avatar
  // @access Private
  async changeBio(req, res) {
    try {
      const bio = await User.findOneAndUpdate(
        { _id: req._id },
        {
          $set: { bio: req.body.bio },
        },
        { new: true }
      ).select('bio');

      return res.json(bio);
    } catch (error) {
      console.log(error);
    }
  }

  async changeSocial(req, res) {
    try {
      const fb = req.body.fb;
      const youtube = req.body.youtube;
      const instagram = req.body.instagram;
      const linkedin = req.body.linkedin;
      const twitter = req.body.twitter;

      const social = await User.findById(req._id).select('socials');

      const socials = await User.findOneAndUpdate(
        { _id: req._id },
        {
          $set: {
            socials: {
              fb: fb ? fb : social.fb,
              youtube: youtube ? youtube : social.youtube,
              instagram: instagram ? instagram : social.instagram,
              linkedin: linkedin ? linkedin : social.linkedin,
              twitter: twitter ? twitter : social.twitter,
            },
          },
        },
        { new: true }
      ).select('socials');

      console.log(socials);

      return res.json(socials);
    } catch (error) {
      console.log(error);
    }
  }

  // @route GET /my-post
  // @desc Get my blog
  // @access Private
  async getMyPost(req, res) {
    try {
      const myBlog = await Blog.find({
        postedBy: req._id,
        isPosted: true,
      }).sort({ createdAt: -1 });

      return res.json(myBlog);
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Get my blog failed!',
      });
    }
  }

  // @route POST /new-job
  // @desc Post new job
  // @access Public
  async newJob(req, res) {
    try {
      const jobData = {
        title: req.body.title,
        minSalary: req.body.minSalary,
        maxSalary: req.body.maxSalary,
        languages: req.body.languages,
        postedBy: req._id,
      };

      const jobs = await Job.create(jobData);

      return res.json(jobs);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route GET /get-job
  // @desc Get all job
  // @access Public
  async getJob(req, res) {
    try {
      const jobs = await Job.find();

      return res.json(jobs);
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route GET /search/:text
  // @desc Search
  // @access Public
  async search(req, res) {
    console.log(req.params.text);
    try {
      const data = await Promise.all([
        Course.find({
          $or: [
            {
              title: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
            {
              search: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
            {
              description: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
          ],
        }).select('_id slug image title description'),
        Blog.find({
          $or: [
            {
              titleDisplay: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
            {
              search: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
            {
              content: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
          ],
        })
          .select('_id slug titleDisplay image likes comments')
          .populate('postedBy', 'photoURL'),
        Video.find({
          $or: [
            {
              title: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
            {
              search: {
                $regex: new RegExp('.*' + req.params.text + '.*', 'i'),
              },
            },
          ],
        }).select('_id videoId title image'),
      ]);

      return res.json({
        courses: data[0],
        blogs: data[1],
        videos: data[2],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // @route POST /help/contact
  // @desc Post Contact
  // @access Public
  async contact(req, res) {
    try {
      const contact = await Contact.create(req.body);
      return res.json({
        success: true,
        message: 'Post success',
        contact,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new HelpController();
