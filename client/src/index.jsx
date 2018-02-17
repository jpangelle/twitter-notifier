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
    axios.post('/message', { 
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
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  autoCompleteName(e) {
    if ((e.keyCode > 48 && e.keyCode < 91) || e.keyCode === 189) {
      console.log('you did it!')
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
                  type="tel"
                  pattern="[1]?[0-9]{3}[-]?[0-9]{3}[-]?[0-9]{4}"
                  size="10"
                  placeholder="555-123-4567"
                  name="phoneNumber"
                />
              </div>
            </div>
            <div className="button-container">
              <button>Text Latest Tweet</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
