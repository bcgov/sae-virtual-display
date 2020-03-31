const config = require('config');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const auth = require('./middleware/auth');
const log = require('./utils/log');
const v1 = require('./routes/api/v1');
const { search } = require('./services/help-provider');

// Config
const token = config.get('token');
const whitelist = config.get('whitelist');
const format = config.get('morganFormat');

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

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(format));
}

async function searcher() {
  try {
    const results = await search(token, 'bbsae');
    app.locals.apps = results;
  } catch (err) {
    log(err);
  }
}

searcher();

app.use(
  auth({
    token,
  }),
);
app.use(cors(corsOptions));
app.use('/api/v1', v1);

module.exports = app;
