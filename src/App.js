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

import InfiniteScroll from './components/InfiniteScroll'
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
        this.setState({ authCode }, () => {
          this.loadUserInfo()
          this.getTL()
        })
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

  loadUserInfo = () => {
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

  loadMore = () => {
    const { tweets } = this.state
    const maxId = tweets[tweets.length - 1].id
    _getTL({ max_id: maxId })
      .then(data => {
        this.setState({
          tweets: tweets.concat(data.slice(1, data.length))
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

          <Button onClick={this.loadUserInfo}>
            Get User Info
          </Button>

          <Button onClick={this.getTL}>
            Get TL
          </Button>

          <Button onClick={this.loadMore}>
            Load more
          </Button>
        </div>

        <div className="row"
             style={{
               display: 'flex'
             }}>
          <div className="col"
               style={{
                 padding: '1em'
               }}
          >
            <UserInfo data={this.state.user}/>
          </div>

          <InfiniteScroll
            selector={'.tweet-list'}
            >
            <div className="col tweet-list">
              {this.state.tweets.map(item => <Tweet key={item.id} tweet={item}/>)}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default hot(module)(App)
