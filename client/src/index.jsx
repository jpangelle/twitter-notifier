import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { resetFormData, resetButton, sendMessage, showTweets} from '../../helpers/frontend-helpers';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      user: '',
      phoneNumber: '',
      latestTweet: null,
      sendingState: null,
      formattedPhoneNumber: null,
      errorStateUser: false,
      errorStatePhone: false
  	}
  }

  inputChecker() {
    if (this.state.user === '' && this.state.phoneNumber === '') {
      this.setState({
        errorStateUser: true,
        errorStatePhone: true
      })
      return;
    } 
    if (this.state.phoneNumber === '' || this.state.phoneNumber.length < 2) {
      this.setState({
        errorStatePhone: true
      })
      return;
    } 
    const number = phoneUtil.parse(this.state.phoneNumber, 'US');
    const isValid = phoneUtil.isValidNumber(number);
    if (!isValid){
      this.setState({
        errorStatePhone: true
      })  
      return;
    }
    this.setState({
      formattedPhoneNumber: phoneUtil.format(number, PNF.E164)
    })
    showTweets(this);
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
    } else if (this.state.sendingState === 'error') {
      return "error-send";
    }
  }

  changeButtonText() {
    if (this.state.sendingState === null) {
      return "Text Latest Tweet";
    } else if (this.state.sendingState === 'sending') {
      return "Texting Latest Tweet...";
    } else if (this.state.sendingState === 'success') {
      resetButton(this);
      resetFormData(this);     
      return "Sent!";
    } else if (this.state.sendingState === 'error') {
      resetButton(this);
      return "Error! Try Again"
    }
  }

  changesInputBorderUser() {
    if (!this.state.errorStateUser) {
      return "input-normal";
    } else {
      return "input-error";
    }
  }

  changesInputBorderPhone() {
    if (!this.state.errorStatePhone) {
      return "input-normal";
    } else {
      return "input-error";
    }
  }

  blur() {
    $("input[name=user]").blur();
    $("input[name=phoneNumber]").blur();
  }

  clearError(e) {
    if (e.target.name === 'user') {
      this.setState({
        errorStateUser: false,
      })
    } else {
      this.setState({
        errorStatePhone: false,
      })
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
            this.blur()
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
                className={this.changesInputBorderUser()}
                id="user"
                onKeyDown={this.clearError.bind(this)}
                onChange={this.updateInput.bind(this)} 
                value={this.state.user}
                type="text"
                placeholder="elonmusk" 
                name="user" 
              />
            </div>
              {
                !this.state.errorStateUser ? 
                  <div className="validator-placeholder">
                    Please enter a valid Twitter handle
                  </div> :
                  <div className="validator">
                    Please enter a valid Twitter handle
                  </div>
              }
            <div className="phone-number-container">
              <label 
                htmlFor="phoneNumber"
                className="form-header"
              >
                Your Phone Number:
              </label>
              <div>
                <input 
                  className={this.changesInputBorderPhone()}
                  id="phoneNumber"
                  onKeyDown={this.clearError.bind(this)}
                  onChange={this.updateInput.bind(this)}
                  value={this.state.phoneNumber}                  
                  type="tel"
                  placeholder="555-123-4567"
                  name="phoneNumber"
                />
              </div>
                {
                  !this.state.errorStatePhone ? 
                    <div className="validator-placeholder">
                    </div> : 
                    <div className="validator">
                      Please enter a valid phone number
                    </div>
                }
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
