const http = require('http');
const createApplication = require('./app');

function createServer() {
  const app = createApplication();
  return app;
}

module.exports = createServer;