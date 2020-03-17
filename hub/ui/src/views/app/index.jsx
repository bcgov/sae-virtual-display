import React, { useContext, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AppBar from '@src/components/app-bar';
import { SpotlightManager, SpotlightTransition } from '@atlaskit/onboarding';
import useHelp from '@src/hooks/use-help';
import WorkbenchContext from '@src/utils/context';

import Onboarding from '../onboarding';
import Servers from '../servers';
import { Main } from './styles';

function App() {
  const { help } = useContext(WorkbenchContext);
  const helpData = useHelp(help.onboarding);
  const [isHelpEnabled, setHelpEnabled] = useState(false);

  function onToggleOnboarding() {
    if (isHelpEnabled) {
      setHelpEnabled(false);
    } else {
      setHelpEnabled(true);
    }
  }

  return (
    <Router>
      <SpotlightManager>
        <AppBar
          isHelpEnabled={helpData.length > 0}
          onStartTour={onToggleOnboarding}
        />
        <Main>
          <Switch>
            <Route exact path="/">
              <Servers />
            </Route>
            <Route render={() => '404'} />
          </Switch>
        </Main>
        <SpotlightTransition>
          <Onboarding data={helpData} enabled={isHelpEnabled} />
        </SpotlightTransition>
      </SpotlightManager>
    </Router>
  );
}

export default App;
