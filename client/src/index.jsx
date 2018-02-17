import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      user: '',
      phoneNumber: '',
      latestTweet: null,
      sendingState: null,
      formattedPhoneNumber: null
  	}
  }

  resetButtonAndState() {
    setTimeout(() => {
      this.setState({
        user: '',
        phoneNumber: '',
        latestTweet: null,
        sendingState: null
      }) 
    }, 3000);
  }

  sendMessage() {
    axios.post('/message', {
      number: this.state.formattedPhoneNumber,
      latestTweet: this.state.latestTweet
    })
      .then((res) => {
        this.setState({
          sendingState: 'success'
        })
      })
      .catch((error) => {
        this.setState({
          sendingState: 'error'
        })
        console.log(error);
      })
  }

  showTweets() {
    this.setState({
      sendingState: 'sending'
    })
    axios.get('/twitter', {
      params: {
        user: this.state.user
      }
    })
      .then((res) => {
        if (res.data === 'error') {
          alert("User does not exist!");
        } else {
          this.setState({
            latestTweet: {
              username: res.config.params.user,
              tweet: res.data[0].text,
              tweetTime: res.data[0].created_at,
              numberOfFavorites: res.data[0].favorite_count,
              numberOfRetweets: res.data[0].retweet_count
            }
          })
          this.sendMessage()
        }
      })
      .catch((error) => {
        console.log('Error')              
        console.log(error);
    })
  }

  inputChecker() {
    if (this.state.user === '') {
      alert('Please enter a valid twitter handle');
      return;
    } 
    if (this.state.phoneNumber === '' || this.state.phoneNumber.length < 2) {
      alert('Please enter a phone number');
      return;
    } 
    const number = phoneUtil.parse(this.state.phoneNumber, 'US');
    const isValid = phoneUtil.isValidNumber(number);
    if (!isValid){
      alert('Please enter a valid phone number'); 
      return;     
    }
    this.setState({
      formattedPhoneNumber: phoneUtil.format(number, PNF.E164)
    })
    this.showTweets();
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  autoCompleteName(e) {
    if ((e.keyCode > 48 && e.keyCode < 91) || e.keyCode === 189) {
      console.log('you did it!')
    }
  }

  changeButtonClass() {
    if (this.state.sendingState === null || this.state.sendingState === 'sending') {
      return "before-sent-sending";
    } else if (this.state.sendingState === 'success') {
      return "success-send";
    } else if (this.state.sendingState === 'success') {
      return "error-send";
    }
  }

  changeButtonText() {
    if (this.state.sendingState === null) {
      return "Text Latest Tweet";
    } else if (this.state.sendingState === 'sending') {
      return "Texting Latest Tweet...";
    } else if (this.state.sendingState === 'success') {
      this.resetButtonAndState();      
      return "Sent!";
    } else if (this.state.sendingState === 'error') {
      this.resetButtonAndState();
      return "Error! Try Again"
    }
  }



  render () {
  	return (
      <div className="main">
        <div className="logo">
          <img 
            src="https://i.imgur.com/6DzGKff.png"
            alt="logo" 
          />
        </div>
        <div className="form-container">
          <form onSubmit={e => {
            e.preventDefault()
            this.inputChecker()
          }}>
            <div className="twitter-handle-container">
              <label 
                htmlFor="user"
                className="form-header"
              >
                Twitter Handle:
              </label>
              <input 
                className="input"
                id="user"
                onKeyUp={this.autoCompleteName.bind(this)} 
                onChange={this.updateInput.bind(this)} 
                value={this.state.user}
                type="text"
                placeholder="elonmusk" 
                name="user" 
              />
            </div>
            <div className="phone-number-container">
              <label 
                htmlFor="phoneNumber"
                className="form-header"
              >
                Your Phone Number:
              </label>
              <div>
                <input 
                  className="input"
                  id="phoneNumber"
                  onChange={this.updateInput.bind(this)}
                  value={this.state.phoneNumber}                  
                  type="tel"
                  placeholder="555-123-4567"
                  name="phoneNumber"
                />
              </div>
            </div>
            <div className="button-container">
              <button className={this.changeButtonClass()}>{this.changeButtonText()}</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
