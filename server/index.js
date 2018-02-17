const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')
const app = express();
const helpers = require('../helpers/helpers');
const moment = require('moment');

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())

app.post('/message', (req, res) => {
  const number = req.body.number;
  const date = moment(req.body.latestTweet.tweetTime, "ddd MMM DD HH:mm:ss Z YYYY").format('dddd, MMMM Do, YYYY [at] h:mm a');
  const {
    username, 
    tweet, 
    numberOfFavorites: faves,
    numberOfRetweets: rts
  } = req.body.latestTweet;  
  const tweetStringed = `Hello! ${username}'s latest tweet was: 
  
"${tweet}"

This was tweeted on ${date} and has currently been favorited ${faves} times and retweeted ${rts} times.`

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
