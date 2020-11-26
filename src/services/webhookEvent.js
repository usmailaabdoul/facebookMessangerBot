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
     else if (payload === 'APARTMENTS' || payload === 'STUDIO' || payload ===  'SINGLE_ROOM' || payload === 'STORE' || payload === 'DUPLEX' || payload === 'QUEST_HOUSE') {
        global.property_type = payload;
        webHookHelper.chooseLocation(senderID);
     } else if (payload === 'BUEA' || payload ===  'DOUALA' || payload ===  'LIMBE' || payload ===  'KUMBA' || payload ===  'KRIBI' || payload === 'YAOUNDE') {
       webHookHelper.showListings(senderID, payload)
     } else {
       console.log(payload);
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
