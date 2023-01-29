const siteRouter = require('./site');
const userRouter = require('./user');
const courseRouter = require('./course');
const lessonRouter = require('./lesson');
const blogRouter = require('./blog');
const adminRouter = require('./admin.js');
const helpRouter = require('./help');
const commentRouter = require('./comment');
const notificationRouter = require('./notification');
const { Router } = require('express');
const route = Router();

route.use('/login', userRouter);
route.use('/register', userRouter);
route.use('/auth', userRouter);
route.use('/me', userRouter);
route.use('/courses', courseRouter);
route.use('/lessons', lessonRouter);
route.use('/learning', courseRouter);
route.use('/new-post', blogRouter);
route.use('/blog', blogRouter);
route.use('/help', helpRouter);
route.use('/search', helpRouter);
route.use('/admin', adminRouter);
route.use('/comment', commentRouter);
route.use('/notification', notificationRouter);
route.use('/', siteRouter);

module.exports = route;
