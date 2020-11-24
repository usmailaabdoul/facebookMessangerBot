require('dotenv').config();
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
            "title":responseBody[i].food_name,
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
                recipient: {id: recipientId},
                message: messageData,
            }
    }, function(error, response, body){
        if (error) {
            console.log("Error sending message: " + response.error)
        }
    })
  }
}

const webhookHelpers = new WebhookHelpers();

module.exports = webhookHelpers;
