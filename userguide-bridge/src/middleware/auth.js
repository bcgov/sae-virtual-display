const log = require('../utils/log');

function auth(options) {
  return (req, res, next) => {
    req.token = options.token;
    next();
  };
}

module.exports = auth;
