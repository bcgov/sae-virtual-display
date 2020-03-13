import React, { useContext, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AppBar from '@src/components/app-bar';
import sanitize from 'sanitize-html';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTransition,
} from '@atlaskit/onboarding';
import useHelp from '@src/hooks/use-help';
import WorkbenchContext from '@src/utils/context';

import Servers from '../servers';
import { Main } from './styles';

function App() {
  const { helpArticles } = useContext(WorkbenchContext);
  const content = useHelp(helpArticles.onboarding);
  const [helpIndex, setHelp] = useState(0);

  const renderActiveSpotlight = () => {
    const section = content[helpIndex - 1];
    if (helpIndex > 0 && section) {
      return (
        <Spotlight
          actions={[
            { onClick: () => setHelp(s => s + 1), text: 'Next' },
            { onClick: () => setHelp(s => s - 1), text: 'Prev' },
          ]}
          dialogPlacement="right center"
          heading={section.page.title}
          target={`help-${section.page.numbering}`}
        >
          <div
            dangerouslySetInnerHTML={{ __html: sanitize(section.page.body) }}
          />
        </Spotlight>
      );
    }

    return null;
  };

  return (
    <Router>
      <SpotlightManager>
        <AppBar
          isHelpEnabled={content.length > 0}
          onStartTour={() => setHelp(1)}
        />
        <Main>
          <Switch>
            <Route exact path="/">
              <Servers />
            </Route>
            <Route render={() => '404'} />
          </Switch>
        </Main>
        <SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
      </SpotlightManager>
    </Router>
  );
}

export default App;
