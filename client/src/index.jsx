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
        this.setState({
          latestTweet: {
            username: res.config.params.user,
            tweet: res.data[0].text,
            tweetTime: res.data[0].created_at,
            numberOfFavorites: res.data[0].favorite_count,
            numberOfRetweets: res.data[0].retweet_count
          }
        })               
      })
      .then((res) => {
        this.sendMessage()
      })
      .catch((error) => {
        console.log('Error')              
        console.log(error);
    })
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

  render () {
  	return (
      <div>
        <form>
          Twitter Handle: <input onChange={this.updateInput.bind(this)} type="text" name="user" /><br />
          Your Phone Number: <input onChange={this.updateInput.bind(this)} type="text" name="phone-number" />          
        </form>
        <button onClick={this.showTweets.bind(this)}>Send Latest Tweet</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
