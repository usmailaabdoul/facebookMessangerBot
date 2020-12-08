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
  let body = req.body;

  if (body.object === 'page') {

    body.entry.forEach((entry) => {

      entry.messaging.forEach((event) => {
        if (event.postback) {
          console.log({event});
          webhookServices.postbackEvent(event);
        } 
        else if (event.message) {
          webhookServices.messageEvent(event);
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404).json('Something unexpected happened');
  }
});

module.exports = router;