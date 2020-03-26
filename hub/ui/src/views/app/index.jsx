import React, { useContext, useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AppBar from '@src/components/app-bar';
import { SpotlightManager, SpotlightTransition } from '@atlaskit/onboarding';
import useHelp from '@src/hooks/use-help';
import WorkbenchContext from '@src/utils/context';

import Onboarding from '../onboarding';
import Servers from '../servers';
import { Main } from './styles';

function App() {
  const { help, user } = useContext(WorkbenchContext);
  const { data, request } = useHelp(help.onboarding);
  const [isHelpEnabled, setHelpEnabled] = useState(false);

  function onToggleOnboarding() {
    if (isHelpEnabled) {
      setHelpEnabled(false);
    } else {
      setHelpEnabled(true);
    }
  }

  useEffect(() => {
    request();
  }, [request]);

  return (
    <Router>
      <SpotlightManager>
        <AppBar
          isHelpEnabled={data.length > 0}
          onStartTour={onToggleOnboarding}
          user={user}
        />
        <Main>
          <Switch>
            <Route exact path="/">
              <Servers />
            </Route>
          </Switch>
        </Main>
        <SpotlightTransition>
          <Onboarding
            data={data}
            enabled={isHelpEnabled}
            onComplete={onToggleOnboarding}
          />
        </SpotlightTransition>
      </SpotlightManager>
    </Router>
  );
}

export default App;
