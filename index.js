const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./src/config/db/index');
const route = require('./src/routes');
const compression = require('compression');
const helmet = require('helmet');
const socketHandlers = require('./src/helper/socket');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const morgan = require('morgan');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');
require('dotenv').config();

connectToDb();

const PORT = process.env.PORT || 5000;
const acceptedOrigins = ['localhost', '127.0.0.1'];
const morganFormat = 'dev';
const urlencodedConfig = { extended: true };

app.use(cors(acceptedOrigins))
  .use(helmet())
  .use(morgan(morganFormat))
  .use(compression())
  .use(express.json())
  .use(express.urlencoded(urlencodedConfig));

app.use(route);

app.use(notFound);
app.use(errorHandler);

const io = new Server(httpServer, {
  cors: {
    origin: '*',

    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
      });
      res.end();
    },
  },
});
socketHandlers(io);

httpServer.listen(PORT, () => `Server started on port ${PORT}`);
