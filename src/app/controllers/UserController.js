const User = require('../models/User')
const Blog = require('../models/Blog')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const MailHtml = require('../../helper/mailHTML')
const removeAccents = require('vn-remove-accents')
const createError = require('http-errors')

class UserController {
  // @route GET api/auth
  // @desc Check if user is logged in
  // @access Public
  async getUser(req, res, next) {
    try {
      const { _id } = req
      let user = await User.findById({ _id })

      return !user
        ? res.json({ success: false, message: 'User not found' })
        : res.json({ success: true, message: 'Is Valid token', user })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /register
  // @desc Register
  // @access Public
  async register(req, res, next) {
    const { fullName, password, phoneNumber } = req.body

    try {
      const slugExist = await User.find({
        slug: {
          $regex: removeAccents(fullName.toLowerCase().replace(/\s/g, '')),
          $options: 'i',
        },
      })

      let slugExistIndex = ''
      const isExistUserSlug = slugExist && slugExist.length > 0
      if (isExistUserSlug) slugExistIndex = slugExist.length + 1

      let passwordHashed
      const saltRounds = 10
      if (password) passwordHashed = await bcrypt.hash(password, saltRounds)

      const user = await User.create({
        ...req.body,
        password: passwordHashed,
        slug: `@${removeAccents(
          String(fullName + slugExistIndex)
            .toLowerCase()
            .replace(/\s/g, '')
        )}`,
      })

      if (phoneNumber) {
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.ACCESS_TOKEN_SECRET
        )

        return res.json({
          success: true,
          message: 'Register success!',
          user,
          accessToken,
        })
      }

      return res.json({
        success: true,
        message: 'Register success!',
        user,
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /login/email-password
  // @desc Login with email and password
  // @access Public
  async login(req, res, next) {
    try {
      const { email, password } = req.body

      let user = await User.findOne({ email })

      if (!user)
        return res.json({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác',
        })

      if (password) {
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
          return res.json({
            success: false,
            message: 'Tài khoản hoặc mật khẩu không chính xác',
          })
      }

      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET
      )

      return res.json({
        success: true,
        message: 'Đăng nhập thành công',
        user,
        accessToken,
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /login/provider
  // @desc Login with provider
  // @access Public
  async loginWithProvider(req, res, next) {
    try {
      const { phoneNumber, email, fullName } = req.body

      if (phoneNumber) {
        try {
          const user = await User.findOne({
            phoneNumber,
          })

          const accessToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET
          )

          return res.json({
            success: true,
            message: 'Login successfully!',
            user,
            accessToken,
          })
        } catch (error) {
          return res.json({
            success: false,
            message: 'Login failed!',
          })
        }
      }

      // Login with fb, google, github
      const userCreated = await User.findOne({
        email,
      })

      if (userCreated) {
        const accessToken = jwt.sign(
          { _id: userCreated._id },
          process.env.ACCESS_TOKEN_SECRET
        )

        return res.json({
          success: true,
          message: 'Login successfully!',
          userCreated,
          accessToken,
        })
      }

      const slugExist = await User.find({
        slug: {
          $regex: removeAccents(fullName.toLowerCase().replace(/\s/g, '')),
          $options: 'i',
        },
      })

      let slugExistIndex = ''
      const isSlugExist = slugExist && slugExist.length > 0
      if (isSlugExist) slugExistIndex = slugExist.length + 1

      const user = await User.create({
        ...req.body,
        slug: `@${removeAccents(
          String(fullName + slugExistIndex)
            .toLowerCase()
            .replace(/\s/g, '')
        )}`,
      })

      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET
      )

      return res.json({
        success: true,
        message: 'Login successfully!',
        user,
        accessToken,
      })
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Login failed!',
      })
    }
  }

  // @route POST /register/verify
  // @desc Send email verification
  // @access Public
  async verify(req, res, next) {
    const { email, option, otp } = req.body

    try {
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      })

      await transport.sendMail({
        from: 'f8clone@gmail.com',
        to: email,
        subject:
          option === 'signUp'
            ? `${otp} là mã xác minh của bạn`
            : 'Yêu cầu khôi phục mật khẩu F8',
        html: MailHtml({
          option: option,
          otp: otp,
        }),
      })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /login/check-email
  // @desc Check user email exist
  // @access Public
  async checkEmail(req, res, next) {
    try {
      const { email } = req.body

      const emailExist = await User.findOne({ email })

      return !emailExist
        ? res.json({
            notUsed: 'Email chưa được sử dụng',
          })
        : res.json({
            used: 'Email đã được sử dụng',
          })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /login/phone-number
  // @desc Check user phone number exist
  // @access Public
  async checkPhoneNumberExist(req, res, next) {
    try {
      const { phoneNumber } = req.body

      const phoneExist = await User.findOne({
        phoneNumber,
      })

      return !phoneExist
        ? res.json({
            notUsed: 'Số điện thoại chưa được sử dụng',
          })
        : res.json({
            used: 'Số điện thoại đã được sử dụng',
          })
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route POST /login/reset-password
  // @desc Reset password
  // @access Public
  async resetPassword(req, res, next) {
    try {
      const { password, email } = req.body

      const saltRounds = 10
      const passwordHashed = await bcrypt.hash(password, saltRounds)

      await User.findOneAndUpdate({ email }, { password: passwordHashed })

      return res.json({
        success: true,
        message: 'Password has been reset',
      })
    } catch (error) {
      console.error(error.message)
      return res.json({
        success: false,
        message: 'Password reset failed',
      })
    }
  }

  // @route PATCH /me/bookmark
  // @desc Bookmark post
  // @access Private
  async bookmark(req, res, next) {
    try {
      const { _id } = req
      const { blogId } = req.body

      const bookmarked = await User.findById(_id).select('bookmark')

      const isBookmarkedBlog = bookmarked.bookmark.includes(blogId)

      if (isBookmarkedBlog) {
        const bookmark = await User.findByIdAndUpdate(
          _id,
          {
            $pull: { bookmark: blogId },
          },
          { new: true }
        ).select('bookmark')

        return res.json(bookmark)
      }
      const bookmark = await User.findByIdAndUpdate(
        _id,
        {
          $push: { bookmark: { $each: [blogId], $position: 0 } },
        },
        { new: true }
      ).select('bookmark')

      return res.json(bookmark)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET me/bookmark
  // @desc Get bookmark post
  // @access Private
  async getBookmark(req, res, next) {
    try {
      const { _id } = req

      const bookmark = await User.findById(_id).select('bookmark')

      return res.json(bookmark)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }

  // @route GET me/bookmark-post
  // @desc Get bookmark post and author name
  // @access Private
  async getBookmarkAndBlogAuthor(req, res, next) {
    try {
      const { _id } = req

      const blogId = await User.findById(_id).select('bookmark')

      const bookmark = await Blog.find({
        _id: { $in: blogId.bookmark },
      })
        .select('_id titleDisplay slug createdAt')
        .populate('postedBy', '_id fullName')

      return res.json(bookmark)
    } catch (error) {
      console.error(error.message)
      next(createError.InternalServerError())
    }
  }
}

module.exports = new UserController()
