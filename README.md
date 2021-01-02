# facebookMessangerBot
A Facebook messenger bot, this bot interacts with the user using the message bot postback messages, to get information from the user fetches data from an external API and send backs information to the User

## Getting started

- Git clone the repository 
- `cd` into the repo
- `npm install` to install all dependencies

## Deploying to server (sample server `Heroku`)

- Create a new App on Heroku
- Connect new app with the github repository of your node.js project
- Add the required `env` variables
  - `VERIFY_TOKEN`: which is the token gotten from app on facebook developer dashboard used to verify the webhooks
  
- Deploy Heroku app

### Adding a *GET STARTED* button to your bot

`curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload": "<postback_payload>"}
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>"
`
- replace the `PAGE_ACCESS_TOKEN` with your token of the app gotten from facebook developer dashboard
- update the payload message with the corresponding one in the node.js app in this case i put `WELCOME`
  - so replace `<postback_payload>` with `WELCOME`
