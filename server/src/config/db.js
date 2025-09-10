const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');

    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => logger.info('🔗 MongoDB connected'));
    mongoose.connection.on('error', (err) => logger.error('MongoDB error', err));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

    await mongoose.connect(uri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 10000
    });
};

module.exports = { connectDB };
