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

router.post('/webhook', async (req, res, next) => {
  //checking for page subscription.
  if (req.body.object === 'page') {

    /* Iterate over each entry, there can be multiple entries 
    if callbacks are batched. */
    req.body.entry.forEach(function (entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function (event) {
        console.log(event);
        if (event.postback) {
          // webhookServices
        } else if (event.message) {
          // webhookServices
        }
      });
    });
    res.sendStatus(200);
  }
});

module.exports = router;