const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongoose connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = { connect };
