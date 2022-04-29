require('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('./src/config/db/index')
const route = require('./src/routes')
const compression = require('compression')
const createError = require('http-errors')
const helmet = require('helmet')
const logEvents = require('./src/helper/logEvents')
const socketHandlers = require('./src/helper/socket')
const app = express()
const { createServer } = require('http')
const { Server } = require('socket.io')
const httpServer = createServer(app)

db.connect()

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)
app.use(helmet())
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
  })
)
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())

route(app)

app.use((req, res, next) => next(createError.NotFound('Not Found')))
app.use((err, req, res, next) => {
  logEvents(`${req.url} -- ${req.method} -- ${err.message}`)

  const errStatus = err.status || 500

  return res.status(errStatus).json({
    status: errStatus,
    message: err.message,
  })
})

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})
socketHandlers(io)

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => `Server started on port ${PORT}`)
