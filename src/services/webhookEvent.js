class WebhookEvents {
  message() {
    console.log('messages');
  }
}

const webhookEvents = new WebhookEvents();

module.exports = webhookEvents;
