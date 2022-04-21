const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) throw createError.Unauthorized('Access Token Not Found.');

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (decoded) {
    req._id = decoded._id;
    next();
  } else {
    throw createError.Forbidden('Invalid Access Token.');
  }
};

module.exports = verifyToken;
