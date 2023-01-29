const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    await mongoose.connect('mongodb://0.0.0.0:27017');
    require('../../app/models/Lesson');

    console.log('Mongoose connected to DB');
  } catch (error) {
    console.log('Mongoose connected fail to DB', error.message);
  }
};

module.exports = { connectToDb };
