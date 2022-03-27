import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from 'components/Loading/index';
import LoginPage from 'pages/LoginPage'

const User = Loadable({
  loader: () => import('../pages/user'),
  loading: Loading
});

const Test = Loadable({
  loader: () => import('../pages/test'),
  loading: Loading
});

const NotFound = Loadable({
  loader: () => import('../pages/error/404'),
  loading: Loading
});


export default class Container extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact={true} component={User} />
          <Route path="/login" exact={true} component={LoginPage} />
          <Route path="/test" exact={true} component={Test} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    )
  }
}
