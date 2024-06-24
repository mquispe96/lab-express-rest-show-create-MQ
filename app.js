const express = require('express');
const logsController = require('./controllers/logsController.js');

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to My Captain\'s Log App'));

app.use('/logs', logsController);

module.exports = app;
