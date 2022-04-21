require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./src/config/db/index');
const route = require('./src/routes');
const compression = require('compression');
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

db.connect();

io.on('connection', (socket) => {
  socket.on('comment', (comment) => {
    io.emit('comment', comment);
  });
});

http.listen(PORT, () => `Server started on port ${PORT}`);
