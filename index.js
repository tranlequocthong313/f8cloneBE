require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./src/config/db/index');
const route = require('./src/routes');
const compression = require('compression');
const createError = require('http-errors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    },
});

const PORT = process.env.PORT || 5000;

app.use(
    compression({
        level: 6,
        threshold: 100 * 1000,
    })
);

app.use(cors());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

route(app);

app.use((req, res, next) => {
    next(createError.NotFound('Route Not Found'));
});

app.use((err, req, res, next) => {
    return res.json({
        status: err.status || 500,
        message: err.message,
    });
});

db.connect();

io.on('connection', (socket) => {
    socket.on('comment', (comment) => {
        io.emit('comment', comment);
    });
    socket.on('react', (comment) => {
        io.emit('react', comment);
    });
});

http.listen(PORT, () => `Server started on port ${PORT}`);
