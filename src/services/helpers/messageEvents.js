const { messageEvent } = require("../webhookEvent");

class MessageEvents {
  constructor() {}

  handleMessage(message) {
    console.log({message})
    return null
  }

}

const messageEvents = new MessageEvents();

module.exports = messageEvents;
