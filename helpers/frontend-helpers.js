import axios from 'axios';

export function resetFormData(context) {
  setTimeout(() => {
    context.setState({
      user: '',
      phoneNumber: '',
      latestTweet: null,
      errorStateUser: false,
      errorStatePhone: false
    })
  }, 3000);
}

export function resetButton(context) {
  setTimeout(() => {
    context.setState({
      sendingState: null,
    })
  }, 3000);
}

export function sendMessage(context) {
  axios.post('/message', {
    number: context.state.formattedPhoneNumber,
    latestTweet: context.state.latestTweet
  })
    .then((res) => {
      context.setState({
        sendingState: 'success'
      })
    })
    .catch((error) => {
      context.setState({
        sendingState: 'error'
      })
    })
}

export function showTweets(context) {
  context.setState({
    sendingState: 'sending'
  })
  axios.get('/twitter', {
    params: {
      user: context.state.user
    }
  })
    .then((res) => {
      if (res.data === 'error') {
        context.setState({
          errorStateUser: true,
          sendingState: 'error'
        })
        context.changeButtonClass();
      } else {
        context.setState({
          latestTweet: {
            username: res.config.params.user,
            tweet: res.data[0].text,
            tweetTime: res.data[0].created_at,
            numberOfFavorites: res.data[0].favorite_count,
            numberOfRetweets: res.data[0].retweet_count
          }
        })
        sendMessage(context);
      }
    })
    .catch((error) => {
      console.log('Error')
      console.log(error);
    })
}