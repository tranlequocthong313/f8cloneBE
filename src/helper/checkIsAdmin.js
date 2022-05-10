const createError = require('http-errors')

const checkIsAdmin = (req, res, next) => {
  if (req._id !== process.env.ADMIN_ID)
    return next(createError.InternalServerError())

  next()
}

module.exports = checkIsAdmin
