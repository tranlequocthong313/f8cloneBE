require('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('./src/config/db/index')
const route = require('./src/routes')
const compression = require('compression')
const createError = require('http-errors')
const helmet = require('helmet')
const session = require('express-session')
const logEvents = require('./src/helper/logEvents')
const socketHandlers = require('./src/helper/socket')
const app = express()
const http = require('http')
const socketIO = require('socket.io')
const server = http.createServer(app)

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())
// app.set('trust proxy', 1)
// app.use(
//   session({
//     secret: process.env.ACCESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true, httpOnly: true },
//   })
// )

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

db.connect()

const io = socketIO(server, {
  cors: {
    origin:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000'
        : 'https://f8clone.tk:80  ',
    methods: ['GET', 'POST'],
  },
})
socketHandlers(io)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => `Server started on port ${PORT}`)
