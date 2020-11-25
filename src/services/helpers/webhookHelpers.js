require('dotenv').config();
const fetch = require('node-fetch');
const request = require('request');

class WebhookHelpers {

  isTyping(recipientId) {
    request({
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.VERIFY_TOKEN },
      method: "POST",
      json: {
        recipient: { id: recipientId },
        "sender_action": "typing_on"
      }
    }, function (error, response, body) {
      if (error) {
        console.log("Error sending message: " + response.error);
      }
    });
  }

  sendMessage(recipientId, message) {
    return new Promise(function (resolve, reject) {
      request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {
          access_token: process.env.VERIFY_TOKEN
        },
        method: "POST",
        json: {
          recipient: { id: recipientId },
          message: message,
        }
      }, function (error, response, body) {
        if (error) {
          console.log("Error sending message: " + response.error);
          reject(response.error);
        } else {
          resolve(body);
        }
      });
    })
  }

  sendGenericMessage(recipientId, responseBody) {
    console.log(responseBody);
    const nutritionalValue = [];
    for (let i = 0; i < responseBody.length; i++) { // I dont like using forEach
      let obj = {
        "title": responseBody[i].food_name,
        "image_url": responseBody[i].thumbnail,
        "subtitle": 'Total Calories: ' + responseBody[i].total_calories + "\n" +
          'protein: ' + responseBody[i].protein + "\n" +
          'Carbohydrates: ' + responseBody[i].total_carbohydrate,
      }
      nutritionalValue.push(obj);
    }
    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": nutritionalValue
        }
      }
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.VERIFY_TOKEN },
      method: 'POST',
      json: {
        recipient: { id: recipientId },
        message: messageData,
      }
    }, function (error, response, body) {
      if (error) {
        console.log("Error sending message: " + response.error)
      }
    })
  }

  async buttonTemplate(recipientId) {
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
                  title: "Apartments",
                  payload: "APARTMENTS"
                },
                {
                  type: "postback",
                  title: "Studio",
                  payload: "STUDIO"
                },
                {
                  type: "postback",
                  title: "Single room",
                  payload: "SINGLE_ROOM"
                }
              ]
            },
            {
              title: "Not found what you are looking for? chechout website",
              subtitle: 'View more on website',
              default_action: {
                type: "web_url",
                url: "https://digitalrenter.com/",
                webview_height_ratio: "FULL",
              },
              buttons: [
                {
                  type: "postback",
                  title: "Store",
                  payload: "STORE"
                },
                {
                  type: "postback",
                  title: "Duplex",
                  payload: "DUPLEX"
                },
                {
                  type: "postback",
                  title: "Quest house",
                  payload: "QUEST_HOUSE"
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

    console.log(url)
    try {
      let buttonTemplate = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      buttonTemplate = await buttonTemplate.json()
      console.log('buttonTemplate', buttonTemplate)
    } catch (e) {
      console.log("Error sending message: " + e)
    }
  }

  async welcomeUser(recipientId) {
    request({
      url: "https://graph.facebook.com/v2.6/" + recipientId,
      qs: {
        access_token: process.env.VERIFY_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function (error, response, body) {
      let greeting = '';
      let name = ''
      if (error) {
        console.error("Error getting user name: " + error);
      } else {
        let bodyObject = JSON.parse(body);
        console.log(bodyObject);
        name = bodyObject.first_name;
        greeting = "Hello " + name + ". ";
      }
      let message = greeting + "Welcome to DRbot. Hope you are doing good today.";
      let message2 = "I am here to help you find houses for rent without stress."
      webHookHelper.isTyping(recipientId);
      webHookHelper.sendMessage(recipientId, { text: message }).then(() => {
        webHookHelper.sendMessage(recipientId, { text: message2 }).then(() => {
          webHookHelper.buttonTemplate(recipientId)
        });
      });
    });
  }

  async getLocations() {
    return new Promise((resolve, reject) => {
      const fixCitiess = ['Buea', 'Douala', 'Limbe', 'Kumba', 'Kribi', 'Yaounde'];
      let selectedCities = [];

      let url = 'https://api.digitalrenter.com/sandbox/v1/en/locations/cities'
      console.log(url)
      try {
        let cities = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        cities = await cities.json()

        fixCities.map((c) => {
          let index = cities.findIndex((city) => city.name.toLowerCase() === c.toLowerCase());

          if (index > -1) {
            selectedCities.push(cities[index])
          }
        })

        console.log(selectedCities)
        resolve(selectedCities)
      } catch (e) {
        console.log("Error sending message: " + e)
        reject(e)
      }
    })
  }

  async chooseLocation(recipientId) {
    this.isTyping(recipientId);
    let cities = await this.getLocations();

    const formatButtons = (citiesArray) => {
      let i, j, newElements = [], chunk = 3;
      for (i = 0, j = citiesArray.length; i < j; i += chunk) {
        let temp = citiesArray.slice(i, i + chunk);
        newElements.push(temp)
      }
    
      const elements = newElements.map((element) => {
        return {
          title: "What kind of property are you looking for?",
          buttons: element.map((button) => {
            return {
              type: "postback",
              title: button.name,
              payload: button.name.toUpperCase()
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

    console.log(url)
    try {
      let buttonTemplate = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      buttonTemplate = await buttonTemplate.json()
      console.log('buttonTemplate', buttonTemplate)
    } catch (e) {
      console.log("Error sending message: " + e)
    }

  }
}

const webhookHelpers = new WebhookHelpers();

module.exports = webhookHelpers;
