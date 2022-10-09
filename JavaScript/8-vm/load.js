'use strict';

const fs = require('node:fs').promises;
const vm = require('node:vm');
const config = require('./config.js');

const RUN_OPTIONS = {
  timeout: config.sandbox.timeout,
  displayErrors: config.sandbox.displayErrors,
};

module.exports = async (filePath, sandbox) => {
  const src = await fs.readFile(filePath, 'utf8');
  const code = `'use strict';\n${src}`;
  const script = new vm.Script(code);
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  const exported = script.runInContext(context, RUN_OPTIONS);
  return exported;
};
