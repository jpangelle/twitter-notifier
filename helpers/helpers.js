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

function sendMessage(num, message) {
  const client = new twilio(keys.twilio.ACCOUNDSID, keys.twilio.AUTHTOKEN);
  return client.messages.create({
    body: `${message}`,
    to: `+${num}`,
    from: '+13372427294'
  })
}

function verifyUser(user) {

}

exports.getTweets = getTweets;
exports.sendMessage = sendMessage;
exports.verifyUser = verifyUser;

