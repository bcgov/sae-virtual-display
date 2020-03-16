const config = require('config');
const cors = require('cors');
const express = require('express');

const auth = require('./middleware/auth');
const v1 = require('./routes/api/v1');

const whitelist = config.get('whitelist');
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
const app = express();

app.use(auth());
app.use(cors(corsOptions));
app.use('/api/v1', v1);

module.exports = app;
