require('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('./src/config/db/index')
const route = require('./src/routes')
const compression = require('compression')
const createError = require('http-errors')
const helmet = require('helmet')
const logEvents = require('./src/helper/logEvents')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
})

db.connect()

app.use(helmet())

app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
  })
)

app.use(cors())

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

io.on('connection', (socket) => {
  socket.on('comment', (comment) => {
    io.emit('comment', comment)
  })
})

const PORT = process.env.PORT || 5000
http.listen(PORT, () => `Server started on port ${PORT}`)
