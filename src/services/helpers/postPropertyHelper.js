const fetch = require('node-fetch');

const isTyping = require('../interactions/isTyping');
const sendMessage = require('../interactions/sendMessage');
const requestType = require('../interactions/requestType');

class PostPropertyHelper {
  postProperty(recipientId) {
    const message = 'Post a property on DR in 4 simple steps:\n - Download the App.\n - Create a free account.\n - Post/Advertise your property(house/land).\n - Share and wait for clients in your inbox.';

    isTyping(recipientId);
    sendMessage(recipientId, { text: message }).then(() => {
      this.shareDRLink(recipientId);
    });
  }

  async shareDRLink(recipientId) {
    isTyping(recipientId);

    let messageData = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Get started",
          buttons: [
            {
              type: "web_url",
              url: 'https://play.google.com/store/apps/details?id=com.digitalrenter',
              title: "Download App",
              webview_height_ratio: "full"
            }
          ]
        }
      }
    }

    const body = {
      recipient: { id: recipientId },
      message: messageData,
    }
    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.VERIFY_TOKEN}`

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      isTyping(recipientId);
      requestType(recipientId);
    } catch (e) {
      console.log("Error sending message: " + e)
    }
  }
}

const postPropertyHelper = new PostPropertyHelper();

module.exports = postPropertyHelper;
