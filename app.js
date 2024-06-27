const express = require('express');
const cors = require('cors');
const logsController = require('./controllers/logsController.js');
const logsControllerV2 = require('./v2/controllers/logsController.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("Welcome to My Captain's Log App"));

app.use('/logs', logsController);
app.use('/v2/logs', logsControllerV2);

module.exports = app;
