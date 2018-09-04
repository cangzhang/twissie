import logo from './logo.svg';

import './App.css';

import _debounce from 'lodash/debounce'
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { hot } from 'react-hot-loader'

import { EXTENSION_ID } from './services/constants'
import { getAuthorizeUrl } from './services/t'
import * as chromeSrv from './services/chrome-actions'

class App extends Component {
  state = {
    authCode: null
  }

  task = null

  componentDidMount() {
  }

  authorize = () => {
    getAuthorizeUrl()
      .then((url) => {
        chrome.tabs.create({ url }, tab => {
          chrome.tabs.onUpdated.addListener((tabId, updated, thatTab) => {
            chrome.runtime.onMessage.addListener(obj => {
              const { authCode } = this.state

              if (authCode) return

              console.log(`authCode ${obj[EXTENSION_ID]}`)
              this.setState({
                authCode: obj[EXTENSION_ID]
              })
            })
          })
        })
      })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
