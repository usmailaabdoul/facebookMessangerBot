require('dotenv').config();
const fetch = require('node-fetch');

const RequestPropertyHelper = require('./requestPropertyHelper');
const PostPropertyHelper = require('./postPropertyHelper');

const isTyping = require('../interactions/isTyping');
const sendMessage = require('../interactions/sendMessage');

class WebhookHelpers {

  async welcomeUser(recipientId) {
    const url = `https://graph.facebook.com/v2.6/${recipientId}?fields=first_name,last_name&access_token=${process.env.VERIFY_TOKEN}`

    try {
      let user = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      user = await user.json()
      console.log({ user })
      let greeting = `Hi ${user.first_name}.`;
      let message = `${greeting}\n\nI'm Square, your virtual assistant from Digital renter.`;

      isTyping(recipientId);
      sendMessage(recipientId, { text: message }).then(() => {
        RequestPropertyHelper.requestType(recipientId);
      });
    } catch (e) {
      console.log("Error sending message: " + e)
    }
  }

  selectListingLocation(recipientId, property_type) {
    RequestPropertyHelper.chooseLocation(recipientId, property_type)
  }

  showRequestedListings(recipientId, location) {
    RequestPropertyHelper.showListings(recipientId, location)
  }

  selectRequestType(recipientId, payload) {
    if (payload === 'REQUEST') {
      RequestPropertyHelper.propertyType(recipientId);
    } else if (payload === 'POST') {
      //TODO: walk user through the process of posting a property on DR
      PostPropertyHelper.postProperty(recipientId)
    }
  }

}

const webhookHelpers = new WebhookHelpers();

module.exports = webhookHelpers;
