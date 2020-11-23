const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

function createApplication() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.use('/', routes);

  return app;
}

module.exports = createApplication;