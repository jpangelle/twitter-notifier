const twitter = require('twitter');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const twitterClient = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
const twilioClient = new twilio(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

function getTweets(user, callback) {
  
  const params = { 
    screen_name: user,
    count: 25 
  };
  
  twitterClient.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      callback(tweets);
    } else {
      callback('error');
    }
  });
}

function sendMessage(num, message) {
  return twilioClient.messages.create({
    body: `${message}`,
    to: `+${num}`,
    from: '+13372427294'
  })
}

function searchTwitterForUsers(input) {

  const params = {
    q: input,
    count: 5
  };

  twitterClient.get('users/search', params, function (error, users, response) {
    if (!error) {
      callback(users);
    } else {
      callback('error');
    }
  });
}

exports.getTweets = getTweets;
exports.sendMessage = sendMessage;
exports.searchTwitterForUsers = searchTwitterForUsers;

