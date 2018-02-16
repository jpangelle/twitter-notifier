const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')
const app = express();
const helpers = require('../helpers/helpers');

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())

app.post('/twilio', (req, res) => {
  res.json('message successfully sent');
  //helpers.sendMessage().then((message) => res.json(message.sid));
})

app.get('/twitter', (req, res) => {
  const user = req.query.user;
  helpers.getTweets(user, (tweets) => {
    res.send(tweets);
  });
})

app.listen(3000, function() {
  console.log('listening on port 3000!');
});
