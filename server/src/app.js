// Main Express application setup for the API
// Sets security headers, CORS, compression, logging and mounts routes under /api/v1
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const createError = require('http-errors');

const leadRoutes = require('./routes/lead.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error');

const app = express();

app.use(helmet());
if (process.env.CORS_ORIGIN) {
  const origins = process.env.CORS_ORIGIN.split(',').map(s => s.trim());
  app.use(cors({ origin: origins, credentials: true }));
} else {
  app.use(cors());
}
app.use(compression());
// Parse JSON bodies with a small safety limit
app.use(express.json({ limit: '100kb' }));
// HTTP request logger
app.use(morgan('combined'));

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/users', userRoutes);

// 404
app.use((req, res, next) => next(createError(404, 'Route not found')));

// Global error handler
app.use(errorHandler);

module.exports = app;
