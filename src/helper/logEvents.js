const fs = require('fs').promises
const path = require('path')
const { format } = require('date-fns')

const fileName = path.join('__dirname', '../logs', 'events.log')

const logEvents = async (message) => {
  const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`
  const contentLog = `${dateTime} -- ${message}\n`

  try {
    fs.appendFile(fileName, contentLog)
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = logEvents
