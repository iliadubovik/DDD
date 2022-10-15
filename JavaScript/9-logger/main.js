'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const config = require('./config.js');
const staticServer = require('./static.js');
// const load = require('./load.js')(config.sandbox);
require('./db.js').init(config.db);
// const hash = require('./hash.js');
const logger = require('./logger.js');
const transport = require(`./transport/${config.api.transport}.js`);

// const sandbox = {
//   console: Object.freeze(logger),
//   db: Object.freeze(db),
//   common: { hash },
// };
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = require(filePath);
  }

  staticServer('./static', config.static.port);
  transport(routing, config.api.port, logger);
})();
