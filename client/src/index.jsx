import React from 'react';
import ReactDOM from 'react-dom';
import { resetFormData, resetButton, sendMessage, showTweets, inputChecker, changeButtonClass, blur, changeButtonText, changesInputBorderUser, changesInputBorderPhone} from '../../helpers/frontend-helpers';

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

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // TO-DO: Add dynamic searching to twitter handle box
  // autoCompleteName(e) {
  //   if ((e.keyCode > 48 && e.keyCode < 91) || e.keyCode === 189) {
  //     console.log('you did it!')
  //   }
  // }

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
            blur(this)
            inputChecker(this)
          }}>
            <div className="twitter-handle-container">
              <label 
                htmlFor="user"
                className="form-header"
              >
                Twitter Handle:
              </label>
              <input
                ref={(input) => { this.twitterHandleInput = input; }}
                className={changesInputBorderUser(this)}
                id="user"
                onKeyDown={this.clearError.bind(this)}
                onChange={this.updateInput.bind(this,)} 
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
                  ref={(input) => { this.phoneNumberInput = input; }}
                  className={changesInputBorderPhone(this)}
                  id="phoneNumber"
                  onKeyDown={this.clearError.bind(this)}
                  onChange={this.updateInput.bind(this)}
                  value={this.state.phoneNumber}                  
                  type="text"
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
              <button className={changeButtonClass(this)}>{changeButtonText(this)}</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
