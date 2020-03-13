const config = require('config');
const cors = require('cors');
const express = require('express');

const auth = require('./middleware/auth');
const v1 = require('./routes/api/v1');

const app = express();

app.use(auth());
app.use(cors());
app.use('/api/v1', v1);

module.exports = app;
