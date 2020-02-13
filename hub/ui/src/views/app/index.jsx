import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import AppBar from '@src/components/app-bar';
import Servers from '../servers';
import Spawn from '../spawn';

import { Main } from './styles';

function App() {
  return (
    <Router>
      <AppBar />
      <Main>
        <Switch>
          <Route exact path="/">
            <Servers />
          </Route>
          <Route exact path="/spawn">
            <Spawn />
          </Route>
          <Route render={() => '404'} />
        </Switch>
      </Main>
    </Router>
  );
}

export default App;
