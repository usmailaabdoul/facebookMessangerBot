const fetch = require('node-fetch');

async function requestType(recipientId) {
  let messageData = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [{
          title: "Choose an action!",
          subtitle: "What do you want DR to help you with?",
          buttons: [
            {
              type: "postback",
              title: "Advertise a property",
              payload: "POST"
            },
            {
              type: "postback",
              title: "Search for a property",
              payload: "REQUEST"
            },
          ]
        },
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

  } catch (e) {
    console.log("Error sending message: " + e)
  }
}

module.exports = requestType;
