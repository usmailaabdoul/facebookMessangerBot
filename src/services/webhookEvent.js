require('dotenv').config();
const request = require('request');
const webHookHelper = require('./helpers/webhookHelpers');

class WebhookEvents {

  postbackEvent(event) {
    const senderID = event.sender.id;
    const payload = event.postback.payload;
    
    if (payload === 'WELCOME') {
        webHookHelper.welcomeUser(senderID);
     }
     else if (payload === 'APARTMENTS' || 'STUDIO' || 'SINGLE_ROOM' || 'STORE' || 'DUPLEX' || 'QUEST_HOUSE') {
        localStorage.setItem('location', payload)
        webHookHelper.chooseLocation(senderID);
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
