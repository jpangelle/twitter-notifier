import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
import $ from 'jquery';

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
        changeButtonClass(context);
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

export function inputChecker(context) {
  if (context.state.user === '' && context.state.phoneNumber === '') {
    context.setState({
      errorStateUser: true,
      errorStatePhone: true
    })
    return;
  }
  if (context.state.phoneNumber === '' || context.state.phoneNumber.length < 2) {
    context.setState({
      errorStatePhone: true
    })
    return;
  }
  const number = phoneUtil.parse(context.state.phoneNumber, 'US');
  const isValid = phoneUtil.isValidNumber(number);
  if (!isValid) {
    context.setState({
      errorStatePhone: true
    })
    return;
  }
  context.setState({
    formattedPhoneNumber: phoneUtil.format(number, PNF.E164)
  })
  showTweets(context);
}

export function changeButtonClass(context) {
  if (context.state.sendingState === null || context.state.sendingState === 'sending') {
    return "before-sent-sending";
  } else if (context.state.sendingState === 'success') {
    return "success-send";
  } else if (context.state.sendingState === 'error') {
    return "error-send";
  }
}

export function blur() {
  $("input[name=user]").blur();
  $("input[name=phoneNumber]").blur();
}

export function changeButtonText(context) {
  if (context.state.sendingState === null) {
    return "Text Latest Tweet";
  } else if (context.state.sendingState === 'sending') {
    return "Texting Latest Tweet...";
  } else if (context.state.sendingState === 'success') {
    resetButton(context);
    resetFormData(context);
    return "Sent!";
  } else if (context.state.sendingState === 'error') {
    resetButton(context);
    return "Error! Try Again"
  }
}

export function changesInputBorderUser(context) {
  if (!context.state.errorStateUser) {
    return "input-normal";
  } else {
    return "input-error";
  }
}

export function changesInputBorderPhone(context) {
  if (!context.state.errorStatePhone) {
    return "input-normal";
  } else {
    return "input-error";
  }
}