const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (!authHeader)
    return next(createError.Unauthorized('Access Token Not Found.'))
  const token = authHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (decoded) {
    req._id = decoded._id
    next()
  } else {
    return next(createError.Forbidden('Invalid Access Token.'))
  }
}

module.exports = verifyToken
