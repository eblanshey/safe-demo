// Setup settings for the api, namely the firebase app location
import {setup} from 'safe-api';

setup({
  firebaseApp: 'safe-api-usage-demo'
})

import React, { Component } from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import App from './App'
import AppList from './AppList'
import ViewApp from './ViewApp'
import Submit from './Submit'
import Login from './Login'

export class Root extends Component {
  render() {
    return (
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={AppList} />
            <Route path="login" component={Login} />
            <Route path="submit" component={Submit} />
            <Route path="app/:userid/:id" component={ViewApp} />
          </Route>
        </Router>
    )
  }
}
