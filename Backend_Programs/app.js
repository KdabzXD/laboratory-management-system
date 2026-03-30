const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Optional: parse URL-encoded data too
app.use(express.urlencoded({ extended: true }));

// Your routes
const dummyRoutes = require('./routes/dummyRoutes');
app.use('/dummy', dummyRoutes);

module.exports = app;