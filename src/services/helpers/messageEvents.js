const { messageEvent } = require("../webhookEvent");

class MessageEvents {
  constructor() {}

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
    }
    return null
  }

}

const messageEvents = new MessageEvents();

module.exports = messageEvents;
