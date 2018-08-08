import logo from './logo.svg';

import './App.css';
import 'semantic-ui-css/semantic.min.css';

import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import { getAuthorize } from './services/t'

class App extends Component {
  componentDidMount() {
    getAuthorize()
      .then((url) => {
        console.log(url)
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <Button onClick={this.showAlert}>Click</Button>
      </div>
    );
  }
}

export default App;
