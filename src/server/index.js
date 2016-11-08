require('babel-register');
require('css-modules-require-hook/preset');

const winston = require('./logger.js').default;
const logger = winston.loggers.get('app');

//const logger = require('./logger').default;
const conf = require('./configure');
const WEBPACK_DEV_URL = conf.get('SERVER:WEBPACK_DEV_URL') || '';
require('images-require-hook')('.svg', `${WEBPACK_DEV_URL}/static/icons`);

const app = require('./server').default;

const server = app.listen(app.locals.port, app.locals.host, () => {
  const host = server.address().address;
  const port = server.address().port;

  logger.info('Express server listening on http://%s:%s', host, port);
});
