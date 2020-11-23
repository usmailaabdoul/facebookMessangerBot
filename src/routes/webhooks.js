require('dotenv').config();
const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const webhookServices = require('../services/webhookEvent');

router.get('/webhook', async (req, res, next) => {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log('webhook verified');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('verification failed. Token mismatch.');
    res.sendStatus(403);
  }
});

router.post('/ping', async (req, res, next) => {
    res.status(200).json('pong!!!');
});

router.post('/webhook', async (req, res, next) => {
  //checking for page subscription.
  if (req.body.object === 'page') {

    /* Iterate over each entry, there can be multiple entries 
    if callbacks are batched. */
    req.body.entry.forEach(function (entry) {
      
      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      entry.messaging.forEach(function (event) {
        console.log(event);
        if (event.postback) {
          webhookServices.postbackEvent(event);
        } else if (event.message) {
          webhookServices.messageEvent(event);
        }
      });
    });
    res.sendStatus(200);
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404).json('Something unexpected happened');
  }
});

module.exports = router;