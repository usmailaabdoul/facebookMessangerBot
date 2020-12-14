const isTyping = require('../interactions/isTyping');
const sendMessage = require('../interactions/sendMessage');

class PostPropertyHelper {
  postProperty(recipientId) {
    const message = 'This service temporarily not available!';

    isTyping(recipientId);
      sendMessage(recipientId, { text: message }).then(() => {
        this.requestType(recipientId);
      });
  }
}

const postPropertyHelper = new PostPropertyHelper();

module.exports = postPropertyHelper;
