const fileSystem = require('./fileStorage');
const fs = require('fs');

class MessageEvents {
  constructor() { }

  async handleMessage(message) {
    if (message.hasOwnProperty('attachments')) {
      let attachments = message.attachments;
      console.log(JSON.stringify(attachments));

      let imageAttachments = [];
      attachments.map((attachment) => {
        if (attachment.type === 'image') {
          let path = attachment.payload.url;
          let i = path.split('/').pop();
          let name = i.split('?').shift();

          attachment.name = name;

          imageAttachments.push(attachment)
        }
      })

      console.log(imageAttachments)
      try {
        await this.downloadImages(imageAttachments)
        if (fs.existsSync('./src/tempData')) {
          fileSystem.cleanupDirectory()
        }
      } catch (error) {
        console.log(error)
      }

    }

    return null
  }

  async downloadImages(imageAttachments) {
    imageAttachments.map(async (imageAttachment) => {
      try {
        let res = await fileSystem.downloadImage(imageAttachment);
        console.log(res);
      } catch (error) {
        console.log(error)
      }
    });
  }

}

const messageEvents = new MessageEvents();

module.exports = messageEvents;
