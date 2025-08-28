const User = require('../models/User');
const Blog = require('../models/Blog');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MailHtml = require('../../utils/MailHTML');
const removeAccents = require('vn-remove-accents');
const Course = require('../models/Course');

class UserController {
    // @route GET api/auth
    // @desc Check if user is logged in
    // @access Public
    async getUser(req, res) {
        try {
            let user = await User.findById({ _id: req._id });

            console.log(user);

            return !user
                ? res.json({ success: false, message: 'User not found' })
                : res.json({ success: true, message: 'Is Valid token', user });
        } catch (error) {
            console.log(error.message);
            return res.json({
                success: false,
                message: 'Internal server error!',
            });
        }
    }

    // @route POST /register
    // @desc Register
    // @access Public
    async register(req, res) {
        console.log(req.body);

        try {
            const slugExist = await User.find({
                slug: {
                    $regex: removeAccents(
                        req.body.fullName.toLowerCase().replace(/\s/g, '')
                    ),
                    $options: 'i',
                },
            });

            let slugExistIndex = '';
            const isExistUserSlug = slugExist && slugExist.length > 0;
            if (isExistUserSlug) slugExistIndex = slugExist.length + 1;

            let hashPassword;
            const saltRounds = 10;
            const hasPassword = req.body.password;
            if (hasPassword)
                hashPassword = await bcrypt.hash(req.body.password, saltRounds);

            const user = await User.create({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hashPassword,
                phoneNumber: req.body.phoneNumber,
                photoURL: req.body.photoURL,
                activated: req.body.activated,
                slug: `@${removeAccents(
                    String(req.body.fullName + slugExistIndex)
                        .toLowerCase()
                        .replace(/\s/g, '')
                )}`,
            });

            const hasPhoneNumber = req.body.phoneNumber;
            if (hasPhoneNumber) {
                const accessToken = jwt.sign(
                    { _id: user._id },
                    process.env.ACCESS_TOKEN_SECRET
                );

                return res.json({
                    success: true,
                    message: 'Data has been posted',
                    user,
                    accessToken,
                });
            }

            return res.json({
                success: true,
                message: 'Data has been posted',
                user,
            });
        } catch (error) {
            console.log(error.message);
            return res.json({ success: false, message: 'Internal error' });
        }
    }

    // @route POST /login/email-password
    // @desc Login with email and password
    // @access Public
    async login(req, res) {
        try {
            let user = await User.findOne({ email: req.body.email });

            if (!user)
                return res.json({
                    success: false,
                    message: 'Tài khoản hoặc mật khẩu không chính xác',
                });

            const hasPassword =
                user && user.password && user.password.length !== 0;
            if (hasPassword) {
                const isMatch = await bcrypt.compare(
                    req.body.password,
                    user.password
                );

                if (!isMatch)
                    return res.json({
                        success: false,
                        message: 'Tài khoản hoặc mật khẩu không chính xác',
                    });
            } else {
                return res.json({
                    success: false,
                    message: 'Tài khoản hoặc mật khẩu không chính xác',
                });
            }

            const accessToken = jwt.sign(
                { _id: user._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            return res.json({
                success: true,
                message: 'Đăng nhập thành công',
                user,
                accessToken,
            });
        } catch (error) {
            console.log(error.message);
            return res.json({
                success: false,
                message: 'Lỗi hệ thống',
            });
        }
    }

    // @route POST /login/provider
    // @desc Login with provider
    // @access Public
    async loginWithProvider(req, res) {
        console.log('🚀 ~ UserController ~ loginWithProvider ~ req:', req.body);
        try {
            const hasPhoneNumber = req.body.phoneNumber;
            if (hasPhoneNumber) {
                try {
                    const user = await User.findOne({
                        phoneNumber: req.body.phoneNumber,
                    });

                    const accessToken = jwt.sign(
                        { _id: user._id },
                        process.env.ACCESS_TOKEN_SECRET
                    );

                    return res.json({
                        success: true,
                        message: 'Login successfully!',
                        user,
                        accessToken,
                    });
                } catch (error) {
                    return res.json({
                        success: false,
                        message: 'Login failed!',
                    });
                }
            }

            // Login with fb, google, github
            const userCreated = await User.findOne({
                email: req.body.email,
            });

            if (userCreated) {
                const accessToken = jwt.sign(
                    { _id: userCreated._id },
                    process.env.ACCESS_TOKEN_SECRET
                );

                return res.json({
                    hasUserCreatedAlready: true,
                    message: 'Email has been used!',
                    userCreated,
                    accessToken,
                });
            }

            if (!req.body.fullName && req.body.email) {
                req.body.fullName = req.body.email.split('@')[0];
            }

            const baseName = req.body.fullName;
            const normalizedBase = removeAccents(
                baseName.toLowerCase().replace(/\s/g, '')
            );

            const slugExist = await User.find({
                slug: {
                    $regex: normalizedBase,
                    $options: 'i',
                },
            });

            let slugExistIndex = '';
            if (slugExist && slugExist.length > 0) {
                slugExistIndex = slugExist.length + 1;
            }

            const user = await User.create({
                ...req.body,
                slug: `@${removeAccents(
                    String(baseName + slugExistIndex)
                        .toLowerCase()
                        .replace(/\s/g, '')
                )}`,
            });

            const accessToken = jwt.sign(
                { _id: user._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            return res.json({
                success: true,
                message: 'Login successfully!',
                user,
                accessToken,
            });
        } catch (error) {
            console.log(error.message);
            return res.json({
                success: false,
                message: 'Login failed!',
            });
        }
    }

    // @route POST /register/verify
    // @desc Send email verification
    // @access Public
    async verify(req, res) {
        try {
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });

            await transport.sendMail({
                from: 'f8clone@gmail.com',
                to: req.body.email,
                subject:
                    req.body.option === 'signUp'
                        ? `${req.body.otp} là mã xác minh của bạn`
                        : 'Yêu cầu khôi phục mật khẩu F8',
                html: MailHtml({
                    option: req.body.option,
                    otp: req.body.otp,
                }),
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // @route POST /login/check-email
    // @desc Check user email exist
    // @access Public
    async checkEmail(req, res) {
        try {
            const emailExist = await User.findOne({ email: req.body.email });

            return !emailExist
                ? res.json({
                      notUsed: 'Email chưa được sử dụng',
                  })
                : res.json({
                      used: 'Email đã được sử dụng',
                  });
        } catch (error) {
            console.log(error.message);
        }
    }

    // @route POST /login/phone-number
    // @desc Check user phone number exist
    // @access Public
    async checkPhoneNumberExist(req, res) {
        try {
            const phoneExist = await User.findOne({
                phoneNumber: req.body.phoneNumber,
            });

            return !phoneExist
                ? res.json({
                      notUsed: 'Số điện thoại chưa được sử dụng',
                  })
                : res.json({
                      used: 'Số điện thoại đã được sử dụng',
                  });
        } catch (error) {
            console.log(error);
        }
    }

    // @route POST /login/reset-password
    // @desc Reset password
    // @access Public
    async resetPassword(req, res) {
        try {
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(
                req.body.password,
                saltRounds
            );

            await User.findOneAndUpdate(
                { email: req.body.email },
                { password: hashPassword }
            );

            return res.json({
                success: true,
                message: 'Password has been reset',
            });
        } catch (error) {
            console.log(error.message);
            return res.json({
                success: false,
                message: 'Failed',
            });
        }
    }

    // @route PUT /me/bookmark
    // @desc Bookmark post
    // @access Private
    async bookmark(req, res) {
        try {
            const bookmarked = await User.findById(req._id).select('bookmark');

            const isBookmarkedBlog = bookmarked.bookmark.includes(
                req.body.blogId
            );

            if (isBookmarkedBlog) {
                const bookmark = await User.findByIdAndUpdate(
                    req._id,
                    {
                        $pull: { bookmark: req.body.blogId },
                    },
                    { new: true }
                ).select('bookmark');

                return res.json(bookmark);
            }
            const bookmark = await User.findByIdAndUpdate(
                req._id,
                {
                    $push: {
                        bookmark: { $each: [req.body.blogId], $position: 0 },
                    },
                },
                { new: true }
            ).select('bookmark');

            return res.json(bookmark);
        } catch (error) {
            console.log(error.message);
        }
    }

    // @route GET me/bookmark
    // @desc Get bookmark post
    // @access Private
    async getBookmark(req, res) {
        try {
            const bookmark = await User.findById(req._id).select('bookmark');

            return res.json(bookmark);
        } catch (error) {
            console.log(error.message);
        }
    }

    // @route GET me/bookmark-post
    // @desc Get bookmark post and author name
    // @access Private
    async getBookmarkAndBlogAuthor(req, res) {
        try {
            const blogId = await User.findById(req._id).select('bookmark');

            const bookmark = await Blog.find({
                _id: { $in: blogId.bookmark },
            })
                .select('_id titleDisplay slug createdAt')
                .populate('postedBy', '_id fullName');

            return res.json(bookmark);
        } catch (error) {
            console.log(error.message);
        }
    }

    // @route GET me/:slug
    // @desc Get user by slug
    // @access Public
    async getUserBySlug(req, res) {
        try {
            console.log('CALLED BY CLIENT');
            console.log(req.params.slug);

            const user = await User.findOne({
                slug: req.params.slug,
            }).populate({
                path: 'coursesEnrolled',
                select: '-episode -requirement -topics -comments',
            });

            console.log('USER BY SLUG: ', user);

            res.json(user);
        } catch (error) {
            console.log(error);
        }
    }

    // @route GET /me/enrolled-courses
    // @desc Get user's enrolled courses
    // @access Private
    async getUserEnrolledCourse(req, res) {
        try {
            const user = await User.findById(req._id);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                    success: false,
                });
            }

            const courses = await Course.find({
                _id: { $in: user.coursesEnrolled },
            }).select('-episode -requirement -topics -comments');

            return res.json({
                message: 'Get enrolled courses successfully!',
                success: true,
                courses,
            });
        } catch (error) {
            console.log(
                '🚀 ~ UserController ~ getUserEnrolledCourse ~ error:',
                error
            );
            return res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }
}

module.exports = new UserController();
