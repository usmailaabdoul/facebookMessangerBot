const { messageEvent } = require("../webhookEvent");

class MessageEvents {
  constructor() {}

  handleMessage(message) {
    if (message.hasOwnProperty('attachments')) {
      let attachments = message.attachments;
      console.log({attachments});
      
      let imageAttachments = [];
      attachments.map((attachment) => {
        if (attachment.type === 'image') {
          let path = attachment.url;
          let i = path.split('/').pop();
          let name = i.spilt('?').shift();
          
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
