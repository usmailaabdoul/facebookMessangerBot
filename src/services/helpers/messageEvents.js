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
      await this.downloadImages(imageAttachments)
        .then(() => {
          this.uploadImages()
          fileSystem.cleanupDirectory()
        })

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

  async uploadImages() {
    console.log('uploading images to DR')
  }

}

const messageEvents = new MessageEvents();

module.exports = messageEvents;
