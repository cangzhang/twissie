import './App.css';

import _debounce from 'lodash/debounce'
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { hot } from 'react-hot-loader'

import { EXTENSION_ID } from './services/constants'
import { openNewTab } from './services/chrome-actions'
import {
  getAccessToken as _getAccessToken,
  getAuthorizeUrl,
  getCurUserInfo as _getCurUserInfo,
  getTimeLine as _getTL,
} from './services/twitter-service'
import {
  getAuthCode,
  saveAuthCode
} from './services/auth-control'

import UserInfo from './components/UserInfo'
import Tweet from './components/Tweet'

class App extends Component {
  state = {
    authCode: null,
    user: {},
    tweets: [],
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
              const code = codeMsg[EXTENSION_ID]
              const { authCode } = this.state

              if (authCode && code === authCode) return

              console.log(`== auth code: ${code} ==`)

              this.setState({
                authCode: code
              }, () => {
                saveAuthCode(code)
                _getAccessToken(code)
              })
            })
          })
      })
  }

  getAccessToken = () => {
    _getCurUserInfo()
      .then(user => {
        // console.table(user)
        this.setState({ user })
      })
  }

  getTL = () => {
    _getTL()
      .then(data => {
        this.setState({
          tweets: data,
        })
      })
  }

  render() {
    return (
      <div className="App">
        <div className="row">
          <p>{this.state.authCode || ''}</p>

          <Button onClick={_debounce(this.authorize, 300)}>
            AUTHORIZE
          </Button>

          <Button onClick={this.getAccessToken}>
            Get User Info
          </Button>

          <Button onClick={this.getTL}>
            Get TL
          </Button>
        </div>

        <div className="row">
          <UserInfo data={this.state.user}/>
          {
            this.state.tweets.map(item => <Tweet key={item.id} tweet={item}/>)
          }
        </div>
      </div>
    );
  }
}

export default hot(module)(App)
