const io = require('socket.io');

const initSocket = (http) =>
    io(http, {
        cors: {
            origin: '*',
        },
    });

module.exports = initSocket;
