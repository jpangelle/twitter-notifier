const twitter = require('twitter');
const twilio = require('twilio');
const keys = require('../config.js');

function getTweets(user, callback) {
  const client = new twitter({
    consumer_key: keys.twitter.CONSUMER_KEY,
    consumer_secret: keys.twitter.CONSUMER_SECRET,
    access_token_key: keys.twitter.ACCESS_TOKEN_KEY,
    access_token_secret: keys.twitter.ACCESS_TOKEN_SECRET
  });
  
  const params = { 
    screen_name: user,
    count: 25 
  };

  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      callback(tweets);
    }
  });
}

function sendMessage() {
  const client = new twilio(keys.twilio.ACCOUNDSID, keys.twilio.AUTHTOKEN);
  client.messages.create({
    body: 'Hello World',
    to: '+13372771134',
    from: '+13372427294'
  })
}

exports.getTweets = getTweets;
exports.sendMessage = sendMessage;

