const createHttpError = require('http-errors');
const logEvents = require('../helper/logEvents');

module.exports = {
    notFound: (req, res, next) => {
        throw createHttpError.NotFound('Not Found');
    },
    errorHandler: (err, req, res, next) => {
        logEvents(`${req.url} --- ${req.method} --- ${err.message}`);
        const status = err.status || 500;
        res.status(status);
        const data = {};
        data.status = status;
        data.message = err.message;
        res.json(data);
    }
};
