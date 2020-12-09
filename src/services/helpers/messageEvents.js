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
        let res = await this.downloadImages(imageAttachments)
        console.log('output', res)
        this.uploadImages(imageAttachments)
      } catch (error) {
        console.log({error})
      }
        // .then(() => {
          // fileSystem.cleanupDirectory()
        // })

    }

    return null
  }

  async downloadImages(imageAttachments) {
    return new Promise(async (resolve, reject) => {
      imageAttachments.map(async (imageAttachment) => {
        try {
          let res = await fileSystem.downloadImage(imageAttachment);
          resolve(res)
        } catch (error) {
          console.log(error)
          reject(error)
        }
      });
    })
  }

  async uploadImages(imageAttachments) {
    console.log('uploading images to DR')
    imageAttachments.map((imageAttachment) => {
      let file = fs.existsSync(`${global.directory}/src/tempData/${imageAttachment.name}`)
      console.log(file)
    })
  }

}

const messageEvents = new MessageEvents();

module.exports = messageEvents;
