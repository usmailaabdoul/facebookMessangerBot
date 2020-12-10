require('dotenv').config();

const webHookHelper = require('./helpers/webhookHelpers');
const messageEvents = require('./helpers/messageEvents');

class WebhookEvents {

  postbackEvent(event) {
    const senderID = event.sender.id;
    const payload = event.postback.payload;
    console.log(payload);

    if (payload === 'WELCOME') {
      webHookHelper.welcomeUser(senderID);
    }
    // else if (payload === 'APARTMENT' || payload === 'STUDIO' || payload === 'SINGLE_ROOM' || payload === 'STORE' || payload === 'DUPLEX' || payload === 'QUEST_HOUSE') {
    //   // global.property_type = payload;
    //   webHookHelper.chooseLocation(senderID, payload);
    // } else if (payload === 'BUEA' || payload === 'DOUALA' || payload === 'LIMBE' || payload === 'KUMBA' || payload === 'KRIBI' || payload === 'YAOUNDE') {
    //   webHookHelper.showListings(senderID, payload)
    // } else {
    //   console.log(payload);
    // }
    else if (payload === 'POST' || 'REQUEST') {
      webHookHelper.selectRequestType(payload)
    } 
    else if (payload.includes('REQUEST_PROPERTY')) {
      webHookHelper.chooseLocation(senderID, payload)
    } 
    else if (payload.includes('REQUEST_CITY')) {
      webHookHelper.showListings(senderID, payload)
    } else {
      console.log(payload)
    }
  }

  messageEvent(event) {
    const message = event.message;
    const senderID = event.sender.id;
    // console.log("Received message from senderId: " + senderID);
    // console.log("Message is: " + JSON.stringify(message));
    messageEvents.handleMessage(message);
  }
}

const webhookEvents = new WebhookEvents();

module.exports = webhookEvents;
