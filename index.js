require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./src/config/db/index');
const route = require('./src/routes');
const compression = require('compression');
const createError = require('http-errors');
const initSocket = require('./src/config/socket');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 5000;

const io = initSocket(http);

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

app.use((req, res, next) => {
    req.io = io;
    next();
});

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

http.listen(PORT, '0.0.0.0', () => `Server started on port ${PORT}`);
