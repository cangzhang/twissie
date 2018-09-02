import logo from './logo.svg';

import './App.css';

import { hot } from 'react-hot-loader'
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import { getAuthorizeUrl } from './services/t'
import * as chromeSrv from './services/chrome-actions'

class App extends Component {
  task = null

  componentDidMount() {
  }

  authorize = () => {
    getAuthorizeUrl()
      .then((url) => {
        console.log(url)
        chrome.tabs.create({ url }, tab => {
          console.log(tab)
          chrome.tabs.onUpdated.addListener((tabId, updated, thatTab) => {
            // this.task = setInterval(() => {
            //   if (thatTab.url === `https://api.twitter.com/oauth/authorize`) {
            //     chrome.tabs.executeScript(tabId, obj, () => {
            //       console.log(obj)
            //     })
            //   }
            // }, 300)

            chrome.runtime.onMessage.addListener(
              function(request, sender, sendResponse) {
                  console.log("background.js got a message")
                  console.log(request);
                  console.log(sender);
                  sendResponse("bar");
              }
          )
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

        <Button onClick={this.authorize}>AUTHORIZE</Button>
      </div>
    );
  }
}

export default hot(module)(App)
