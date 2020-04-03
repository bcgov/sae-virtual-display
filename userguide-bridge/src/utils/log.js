const config = require('config');
const debug = require('debug');

const logLevel = config.get('logLevel')

module.exports = debug(logLevel)
