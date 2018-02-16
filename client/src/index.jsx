import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      user: ''
  	}
  }

  sendMessage() {
    axios.post('/twilio').then((res) => {
      console.log('Success!')
      this.showTweets(this.state.user);
    }).catch((error) => {
      console.log(error);
    })
  }

  showTweets(user) {
    axios.get('/twitter', {
      params: {
        user: user
      }
    })
      .then((res) => {
        console.log('Success!')        
        console.log(res);
    }).catch((error) => {
        console.log('Error')              
        console.log(error);
    })
  }

  updateInput(e) {
    this.setState({
      user: e.target.value
    });
  }

  render () {
  	return (
      <div>
        <form>
          <input onChange={this.updateInput.bind(this)} type="text" name="user" />
        </form>
        <button onClick={this.sendMessage.bind(this)}>SUB</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
