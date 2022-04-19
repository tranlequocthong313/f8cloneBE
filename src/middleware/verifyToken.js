const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Access token not found' })

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (decoded) {
    req._id = decoded._id
    next()
  } else {
    return res.status(403).json({ success: false, message: 'Invalid token' })
  }
}

module.exports = verifyToken
