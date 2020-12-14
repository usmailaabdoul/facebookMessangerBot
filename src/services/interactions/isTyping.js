const fetch = require('node-fetch');

async function isTyping(recipientId) {
  const body = {
    recipient: { id: recipientId },
    sender_action: "typing_on"
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
    reject(e);
  }
}

module.exports = isTyping;
