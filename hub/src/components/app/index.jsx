import React from 'react';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';

import AppBar from '../app-bar';
import Dashboard from '../dashboard';
import Dataset from '../dataset';
import Metadata from '../metadata';

import { Main } from './styles';

function App() {
  return (
    <Router>
      <AppBar />
      <Main>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/metadata">
            <Metadata />
          </Route>
          <Route exact path="/metadata/:id">
            <Dataset />
          </Route>
          <Route render={() => '404'} />
        </Switch>
      </Main>
    </Router>
  );
}

export default App;
