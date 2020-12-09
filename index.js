require('dotenv').config();
const createServer = require('./src/server');
const messageEvent = require('./src/services/helpers/messageEvents');

async function init() {
  return createServer();
}

global.directory = __dirname;

init().then(server => {
  server.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);

    const msg = {attachments: [{"type":"image","payload":{"url":"https://scontent.xx.fbcdn.net/v/t1.15752-9/129722105_804649777049443_8783060959549682772_n.jpg?_nc_cat=103&ccb=2&_nc_sid=58c789&_nc_ohc=ikdxTekpY-MAX_oNUSt&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=c047373f6a3a5409845171fd27e7050c&oe=5FF4CACA"}}]}
    messageEvent.handleMessage(msg)
  })
});
