const siteRouter = require('./site')
const userRouter = require('./user')
const courseRouter = require('./course')
const blogRouter = require('./blog')
const adminRouter = require('./admin.js')
const reportRouter = require('./report')
const helpRouter = require('./help')
const commentRouter = require('./comment')
const notificationRouter = require('./notification')

const route = (app) => {
  app.use('/login', userRouter)
  app.use('/register', userRouter)
  app.use('/api', userRouter)
  app.use('/me', userRouter)
  app.use('/courses', courseRouter)
  app.use('/learning', courseRouter)
  app.use('/new-post', blogRouter)
  app.use('/blog', blogRouter)
  app.use('/report', reportRouter)
  app.use('/help', helpRouter)
  app.use('/search', helpRouter)
  app.use('/admin', adminRouter)
  app.use('/comment', commentRouter)
  app.use('/notification', notificationRouter)
  app.use('/', siteRouter)
}

module.exports = route
