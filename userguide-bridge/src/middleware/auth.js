const config = require('config');
const fetch = require('node-fetch');

const credentials = config.get('credentials');
const host = config.get('host');

let token = null;

async function authenticate() {
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

function auth() {
  authenticate();

  return (req, res, next) => {
    if (token) {
      req.token = token;
    }

    next();
  };
}

module.exports = auth;
