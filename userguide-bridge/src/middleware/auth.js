const fetch = require('node-fetch');
const log = require('../utils/log');

let token = null;

async function authenticate({ host, credentials }) {
  try {
    const res = await fetch(`${host}/public/authenticate`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Cache-Control': 'no-cache',
      },
    });
    const json = await res.json();
    token = json.token;
  } catch (err) {
    throw new Error(err);
  }
}

function auth(options) {
  authenticate(options).catch(() => {
    log('Authorization failed');
  });

  return (req, res, next) => {
    req.token = token;
    next();
  };
}

module.exports = auth;
