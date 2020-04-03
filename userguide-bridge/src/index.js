const config = require('config');

const log = require('./utils/log');
const app = require('./app');

const port = config.get('port');

app.listen(port, () => {
  log(`userguide-bridge listening on port ${port}!`);
});
