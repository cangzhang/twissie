import logo from './logo.svg';

import './App.css';

import _debounce from 'lodash/debounce'
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { hot } from 'react-hot-loader'

import { EXTENSION_ID } from './services/constants'
import { getAuthorizeUrl } from './services/t'
import { getAuthCode, saveAuthCode } from './services/auth-control'
import { openNewTab } from './services/chrome-actions'

class App extends Component {
  state = {
    authCode: null
  }

  componentDidMount() {
    getAuthCode()
      .then(authCode => {
        this.setState({ authCode })
      })
      .catch(() => {
        console.warn(`need to get auth code!`)
      })
  }

  authorize = () => {
    getAuthorizeUrl()
      .then(url => {
        openNewTab(url)
          .then(() => {
            chrome.runtime.onMessage.addListener(codeMsg => {
              const { authCode } = this.state
              if (authCode)
                return

              console.log(`Auth code: ${codeMsg[EXTENSION_ID]}`)
              this.setState({
                authCode: codeMsg[EXTENSION_ID]
              }, () => {
                saveAuthCode(authCode)
              })
            })
          })
      })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <p>{this.state.authCode || ''}</p>

        <Button onClick={_debounce(this.authorize, 300)}>
          AUTHORIZE
        </Button>
      </div>
    );
  }
}

export default hot(module)(App)
