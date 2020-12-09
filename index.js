require('dotenv').config();
const createServer = require('./src/server');

async function init() {
  return createServer();
}

global.directory = __dirname;

init().then(server => {
  server.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
  })
});
