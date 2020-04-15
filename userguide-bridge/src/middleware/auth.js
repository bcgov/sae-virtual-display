const log = require('../utils/log');
const { search } = require('../services/help-provider');

async function searcher({ app, applications, token }) {
  try {
    const results = await search(token, applications);
    app.locals.apps = results;
  } catch (err) {
    log(err);
  }
}

function auth(options) {
  searcher(options);

  return (req, res, next) => {
    req.token = options.token;
    next();
  };
}

module.exports = auth;
