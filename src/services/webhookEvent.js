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
    else if (payload === 'APARTMENT' || payload === 'STUDIO' || payload === 'SINGLE_ROOM' || payload === 'STORE' || payload === 'DUPLEX' || payload === 'QUEST_HOUSE') {
      // global.property_type = payload;
      webHookHelper.chooseLocation(senderID, payload);
    } else if (payload === 'BUEA' || payload === 'DOUALA' || payload === 'LIMBE' || payload === 'KUMBA' || payload === 'KRIBI' || payload === 'YAOUNDE') {
      webHookHelper.showListings(senderID, payload)
    } else {
      console.log(payload);
    }
  }

  messageEvent(event) {
    const message = event.message;
    const senderID = event.sender.id;
    console.log("Received message from senderId: " + senderID);
    console.log("Message is: " + JSON.stringify(message));
  }
}

const webhookEvents = new WebhookEvents();

module.exports = webhookEvents;
