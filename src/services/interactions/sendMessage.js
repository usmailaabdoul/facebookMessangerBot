const fetch = require('node-fetch');

function sendMessage(recipientId, message) {
  return new Promise(async (resolve, reject) => {
    const body = {
      recipient: { id: recipientId },
      message: message,
    }

    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.VERIFY_TOKEN}`

    try {
      let data = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      data = await data.json()
      resolve(data)
    } catch (e) {
      console.log("Error sending message: " + e)
      reject(e);
    }
  })
}

module.exports = sendMessage;
