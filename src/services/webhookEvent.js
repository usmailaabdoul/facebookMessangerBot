require('dotenv').config();
const request = require('request');
const webHookHelper = require('./helpers/webhookHelpers');

class WebhookEvents {

  postbackEvent(event) {
    const senderID = event.sender.id;
    const payload = event.postback.payload;

    if (payload === 'WELCOME') {
      request({
        url: "https://graph.facebook.com/v2.6/" + senderID,
        qs: {
          access_token: process.env.VERIFY_TOKEN,
          fields: "first_name"
        },
        method: "GET"
      }, function (error, response, body) {
        let greeting = '';
        if (error) {
          console.error("Error getting user name: " + error);
        } else {
          let bodyObject = JSON.parse(body);
          console.log(bodyObject);
          name = bodyObject.first_name;
          greeting = "Hello " + name + ". ";
        }
        let message = greeting + "Welcome to Healthbot. Hope you are doing good today";
        let message2 = "I am your nutrition tracker :-)"
        let message3 = "please type in what you ate like: I ate chicken birayani and 2 chapatis with dal.";
        webHookHelper.isTyping(senderID);
        webHookHelper.sendMessage(senderID, { text: message }).then(() => {
          webHookHelper.sendMessage(senderID, { text: message2 }).then(() => {
            webHookHelper.sendMessage(senderID, { text: message3 }).then(() => {
              webHookHelper.sendMessage(senderID, { text: '🎈' });
            })
          });
        });
      });
    }
  }

  messageEvent(event) {
    if (!event.message.is_echo) {
      const message = event.message;
      const senderID = event.sender.id;
      console.log("Received message from senderId: " + senderID);
      console.log("Message is: " + JSON.stringify(message));
      if (message.text) {
        // now we will take the text recieved and send it to an food tracking API.
        let text = message.text;
        var request = require("request");

        let options = {
          method: 'POST',
          url: 'https://mefit-preprod.herokuapp.com/api/getnutritionvalue',
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          },
          body:
          {
            userID: process.env.USERID,
            searchTerm: text
          },
          json: true
        };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          webHookHelper.isTyping(senderID);
          // after the response is recieved we will send the details in a Generic template
          webHookHelper.sendGenericMessage(senderID, body);
        });

      }
    }
  }
}

const webhookEvents = new WebhookEvents();

module.exports = webhookEvents;
