import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      user: '',
      phoneNumber: null,
      latestTweet: null
  	}
  }

  sendMessage() {
    axios.post('/twilio', { 
      number: this.state.phoneNumber,
      latestTweet: this.state.latestTweet
    })
      .then((res) => {
      })
      .catch((error) => {
        console.log(error);
      })
  }

  showTweets() {
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
      alert('Please enter twitter handle');
      return;
    }
    if (this.state.phoneNumber === null) {
      alert('Please enter a phone number');
      return;
    }
    this.showTweets();
  }

  updateInput(e) {
    if (e.target.name === 'user') {
      this.setState({
        user: e.target.value
      });
    } else {
      this.setState({
        phoneNumber: e.target.value
      });
    }
  }

  enterPressed(e) {
    if (e.keyCode === 13) {
      this.inputChecker();
    }
  }


  render () {
  	return (
      <div className="main">
        <div className="header">
          Enter a Twitter handle to get a text message of their latest tweet.
        </div>
        <div className="form-container">
          <form>
            Twitter Handle: <input onKeyUp={this.enterPressed.bind(this)} onChange={this.updateInput.bind(this)} type="text" name="user" /><br />
            Your Phone Number: <input onKeyUp={this.enterPressed.bind(this)} onChange={this.updateInput.bind(this)} type="" name="phone-number" />          
          </form>
        </div>
        <div className="button-container">
          <button onClick={this.inputChecker.bind(this)}>Send Latest Tweet</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
