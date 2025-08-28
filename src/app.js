const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const createError = require('http-errors');

const leadRoutes = require('./routes/lead.routes');
const errorHandler = require('./middlewares/error');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(morgan('combined'));

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/v1/leads', leadRoutes);

// 404
app.use((req, res, next) => next(createError(404, 'Route not found')));

// Global error handler
app.use(errorHandler);

module.exports = app;
