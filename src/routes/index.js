const siteRouter = require('./site');
const userRouter = require('./user');
const courseRouter = require('./course');
const blogRouter = require('./blog');
const adminRouter = require('./admin.js');
const reportRouter = require('./report');
const helpRouter = require('./help');
const notificationRouter = require('./notification');
const learningNoteRouter = require('./learningNote.js');
const commentRouter = require('./comment');

const route = (app) => {
    app.use('/login', userRouter);
    app.use('/register', userRouter);
    app.use('/api', userRouter);
    app.use('/me', userRouter);
    app.use('/comments', commentRouter);
    app.use('/courses', courseRouter);
    app.use('/learning', courseRouter);
    app.use('/new-post', blogRouter);
    app.use('/blog', blogRouter);
    app.use('/report', reportRouter);
    app.use('/help', helpRouter);
    app.use('/search', helpRouter);
    app.use('/admin', adminRouter);
    app.use('/notification', notificationRouter);
    app.use('/notes', learningNoteRouter);
    app.use('/', siteRouter);
};

module.exports = route;
