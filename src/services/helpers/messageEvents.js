const fileSystem = require('./fileStorage');

class MessageEvents {
  constructor() { }

  handleMessage(message) {
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
      imageAttachments.map(async (imageAttachment) => {
        try {
          let res = await fileSystem.downloadImage(imageAttachment);
          console.log(res);
        } catch (error) {
          console.log(error)
        }
      });

      fileSystem.cleanupDirectory()
    }
    return null
  }

}

const messageEvents = new MessageEvents();

module.exports = messageEvents;
