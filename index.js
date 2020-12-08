require('dotenv').config();
const createServer = require('./src/server');
const appConfig = require('./app.config');
const fileSystem = require('./src/services/helpers/fileStorage');

async function init() {
  return createServer();
}

init().then(server => {
  server.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
  })
});
