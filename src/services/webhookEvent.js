require('dotenv').config();

const webHookHelper = require('./helpers/webhookHelpers');
const messageEvents = require('./helpers/messageEvents');

class WebhookEvents {

  postbackEvent(event) {
    const senderID = event.sender.id;
    const payload = event.postback.payload;

    let propertyRequest = payload.includes('REQUEST_PROPERTY');
    let cityRequest = payload.includes('REQUEST_CITY');

    if (payload === 'WELCOME') {
      webHookHelper.welcomeUser(senderID);
    } 
    if (payload === 'POST' || 'REQUEST') {
      webHookHelper.selectRequestType(senderID, payload)
    } 
    if (propertyRequest) {
      webHookHelper.chooseLocation(senderID, payload)
    } 
    if (cityRequest) {
      webHookHelper.showListings(senderID, payload)
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
