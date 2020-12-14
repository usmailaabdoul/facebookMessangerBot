require('dotenv').config();
const fetch = require('node-fetch');

class WebhookHelpers {
  constructor() {
    this.property_type = '';
    this.selectedLocation = {};
    this.listOfCities = [];
    this.listingsUrl = '';
    this.token = process.env.DR_TOKEN
  };

  async isTyping(recipientId) {
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

      this.isTyping(recipientId);
      this.sendMessage(recipientId, { text: message }).then(() => {
        this.requestType(recipientId);
      });
    } catch (e) {
      console.log("Error sending message: " + e)
    }
  }

  sendMessage(recipientId, message) {
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

  async requestType(recipientId) {
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

  postProperty(recipientId) {
    const message = 'This service temporarily not available!';

    this.isTyping(recipientId);
      this.sendMessage(recipientId, { text: message }).then(() => {
        this.requestType(recipientId);
      });
  }

  async propertyType(recipientId) {
    let messageData = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "What kind of property are you looking for?",
              subtitle: "Swipe left/right for more options.",
              buttons: [
                {
                  type: "postback",
                  title: "Apartment",
                  payload: "REQUEST_PROPERTY_APARTMENT"
                },
                {
                  type: "postback",
                  title: "Studio",
                  payload: "REQUEST_PROPERTY_STUDIO"
                },
                {
                  type: "postback",
                  title: "Single room",
                  payload: "REQUEST_PROPERTY_SINGLE_ROOM"
                }
              ]
            },
            {
              title: "Here are more options you can select from.",
              buttons: [
                {
                  type: "postback",
                  title: "Store",
                  payload: "REQUEST_PROPERTY_STORE"
                },
                {
                  type: "postback",
                  title: "Duplex",
                  payload: "REQUEST_PROPERTY_DUPLEX"
                },
                {
                  type: "postback",
                  title: "Quest house",
                  payload: "REQUEST_PROPERTY_QUEST_HOUSE"
                }
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

  selectRequestType(recipientId, payload) {
    if (payload === 'REQUEST') {
      this.propertyType(recipientId);
    } else if (payload === 'POST') {
      //TODO: walk user through the process of posting a property on DR
      this.postProperty(recipientId)
    }
  }

  async getLocations() {
    return new Promise(async (resolve, reject) => {
      const fixCities = ['Buea', 'Douala', 'Limbe', 'Kumba', 'Kribi', 'Yaounde'];
      let selectedCities = [];

      let url = 'https://api.digitalrenter.com/v1/en/locations/cities'

      try {
        let cities = await fetch(url, {
          method: 'GET',
          headers: { 
            AppToken:  this.token,
            'Content-Type': 'application/json' 
          }
        })
        cities = await cities.json()

        fixCities.map((c) => {
          let index = cities.data.findIndex((city) => city.name.toLowerCase() === c.toLowerCase());

          if (index > -1) {
            selectedCities.push(cities.data[index])
          }
        })

        resolve(selectedCities)
      } catch (e) {
        console.log("Error getting cities: " + e)
        reject(e)
      }
    })
  }

  async chooseLocation(recipientId, property_type) {
    let propertyType = property_type.split('_').pop();

    this.property_type = propertyType;

    this.isTyping(recipientId);
    let cities = await this.getLocations();
    this.listOfCities = cities

    const formatButtons = (citiesArray) => {
      let i, j, newElements = [], chunk = 3;
      for (i = 0, j = citiesArray.length; i < j; i += chunk) {
        let temp = citiesArray.slice(i, i + chunk);
        newElements.push(temp)
      }

      const elements = newElements.map((element, i) => {
        const message = i > 0 ? 'Here are more locations!' : "In which location?";

        return {
          title: message,
          buttons: element.map((button) => {
            return {
              type: "postback",
              title: button.name,
              payload: `REQUEST_CITY_${button.name.toUpperCase()}`
            }
          })
        }
      })

      return elements
    }

    let messageData = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: formatButtons(cities)
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

  async showAllListings(recipientId) {
    let listingsUrl = this.listingsUrl;

    let messageData = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Haven't found what you need?\nView more properties on Digital Renter",
          buttons: [
            {
              type: "web_url",
              url: listingsUrl,
              title: "Continue to digitalrenter.com",
              webview_height_ratio: "full"
            }
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

  async getListings(recipientId) {
    let location = `city-${this.selectedLocation.name}-${this.selectedLocation.id}`
    let property_type = this.property_type;

    this.isTyping(recipientId);
    return new Promise(async (resolve, reject) => {
      let url = `https://api.digitalrenter.com/v1/en/listings?page=1&location=${location}&property_type=${property_type}&listing_type=client_has&order=created_at`;

      this.listingsUrl = `https://digitalrenter.com/en/search?house_type[]=${property_type}&location=${location}`;

      try {
        let listings = await fetch(url, {
          method: 'GET',
          headers: { 
            AppToken:  this.token,
            'Content-Type': 'application/json'
          }
        })
        listings = await listings.json()

        let data = listings.data.splice(0, 9);
        resolve(data)
      } catch (e) {
        console.log("Error getting cities: " + e)
        reject(e)
      }
    })
  }

  async showListings(recipientId, location) {
    let selectedLocation = location.split('_').pop();

    let index = this.listOfCities.findIndex((city) => city.name.toLowerCase() === selectedLocation.toLowerCase())

    if (index > -1) {
      this.selectedLocation = this.listOfCities[index]
    };

    let listings = await this.getListings(recipientId);

    const listingsElement = [];

    if (listings.length > 0) {
      listings.map((listing) => {
        let quarter = listing.quarter !== null ? listing.quarter.name : '';
        let image_url = listing.images.length > 0 ? listing.images[0].path : 'https://digitalrenter.com/front/img/house-search.png';

        let element = {
          title: `${listing.house_type.name} to ${listing.operation} in ${quarter}`,
          image_url: image_url,
          subtitle: `Price: ${Number(listing.price).toLocaleString()} FCFA per ${listing.billing_cycle.name}.\nQuarter: ${quarter}.`,
          buttons: [
            {
              type: "web_url",
              url: `https://digitalrenter.com/en/ad/${listing.id}`,
              webview_height_ratio: "FULL",
              title: "More Details"
            },
          ]
        }

        listingsElement.push(element)
      })
    } else {
      let element = {
        title: 'Oops, no properties matching this request in this location.',
        image_url: 'https://digitalrenter.s3.us-east-2.amazonaws.com/banner-ads/item-not-found.png',
        subtitle: 'Check other locations above for more options.',
      }

      listingsElement.push(element)
    }

    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": listingsElement
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

      this.showAllListings(recipientId)

    } catch (e) {
      console.log("Error sending message: " + e)
    }
  }

}

const webhookHelpers = new WebhookHelpers();

module.exports = webhookHelpers;
