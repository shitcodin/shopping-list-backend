const mongoose = require('mongoose');
const env = require('./env');

mongoose.set('strictQuery', true);

async function connectDatabase(uri = env.mongoUri) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
}

module.exports = connectDatabase;
