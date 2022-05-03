const consoleLog = (content) => {
  if (process.env !== 'development') return

  console.log(content)
}

module.exports = consoleLog
