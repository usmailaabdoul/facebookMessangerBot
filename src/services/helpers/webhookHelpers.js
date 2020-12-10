require('dotenv').config();
const fetch = require('node-fetch');

class WebhookHelpers {
  constructor() {
    this.property_type = '';
    this.selectedLocation = {};
    this.listOfCities = [];
    this.listingsUrl = '';
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

  sendGenericMessage(recipientId, responseBody) {
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
              title: "Haven't found what you are looking for? chechout our website",
              default_action: {
                type: "web_url",
                url: "https://digitalrenter.com/",
                webview_height_ratio: "FULL",
              },
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

  async welcomeUser(recipientId) {
    const url = `https://graph.facebook.com/v2.6/${recipientId}?fields=first_name,last_name&access_token=${process.env.VERIFY_TOKEN}`

    try {
      let user = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      user = await user.json()

      let greeting = `Hi ${user.first_name}.`;
      let message = `${greeting} \n\n I'm Square, your virtual assistant from Digital renter.`;

      this.isTyping(recipientId);
      this.sendMessage(recipientId, { text: message }).then(() => {
        this.requestType(recipientId);
      });
    } catch (e) {
      console.log("Error sending message: " + e)
    }
  }

  async getLocations() {
    return new Promise(async (resolve, reject) => {
      const fixCities = ['Buea', 'Douala', 'Limbe', 'Kumba', 'Kribi', 'Yaounde'];
      let selectedCities = [];

      let url = 'https://api.digitalrenter.com/sandbox/v1/en/locations/cities'

      try {
        let cities = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
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

    console.log({propertyType});
    
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

      const elements = newElements.map((element) => {
        return {
          title: "In which location?",
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
          text: "Haven't found what you need? \n View more properties on Digital Renter",
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
      let url = `https://api.digitalrenter.com/sandbox/v1/en/listings?page=1&location=${location}&property_type=${property_type}&listing_type=client_has`;
      this.listingsUrl = `https://digitalrenter.com/en/search?house_type%5B%5D=${property_type}&location=${location}`;

      try {
        let listings = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
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

    listings.map((listing) => {
      let quarter = listing.quarter !== null ? listing.quarter.name : '';
      let image_url = listing.images.length > 0 ? listing.images[0].path : 'https://digitalrenter.com/front/img/house-search.png';
      let owner = listing.manager_or_estate_name !== null ? listing.manager_or_estate_name : '';

      let element = {
        title: listing.headline,
        image_url: image_url,
        subtitle: `Price: ${listing.price} \n Quarter: ${quarter} \n Owner: ${owner}`,
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

  selectRequestType(recipientId, payload) {
    if (payload === 'REQUEST') {
      this.propertyType(recipientId);
    } else if (payload === 'POST') {
      //TODO: walk user through the process of posting a property on DR
    }
  }
}

const webhookHelpers = new WebhookHelpers();

module.exports = webhookHelpers;
