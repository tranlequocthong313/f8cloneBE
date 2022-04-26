const mongoose = require('mongoose')

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Mongoose connected to DB')
  } catch (error) {
    console.log('Mongoose connected fail to DB', error.message)
  }
}

module.exports = { connect }
