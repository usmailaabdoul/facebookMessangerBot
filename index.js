require('dotenv').config();
const createServer = require('./src/server');
const appConfig = require('./app.config');

async function init() {
  return createServer();
}

global.property_type = '';

init().then(server => {
  server.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
  })
});
