const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')
const app = express();
const helpers = require('../helpers/helpers');

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())

app.post('/twilio', (req, res) => {
  const number = req.body.number;
  const {
    username, 
    tweet, 
    tweetTime: time,
    numberOfFavorites: faves,
    numberOfRetweets: rts
  } = req.body.latestTweet;  
  const tweetStringed = `Hello! ${username}'s latest tweet was: 
  
"${tweet}"

This was tweeted at ${time} and has ${faves} favorites and ${rts} retweets.`
  //comment this out when demoing
  //res.json('Number:', number);
  //uncomment out when demoing
  helpers.sendMessage(number, tweetStringed).then((message) => res.json(message.sid));
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
