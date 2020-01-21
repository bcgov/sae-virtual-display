import * as React from 'react';
import NavButton from '@src/components/nav-button';
import ServersList from '@src/components/servers-list';

import { Container } from './styles';

function ServersView() {
  return (
    <Container>
      <div>
        <header>
          <NavButton appearance="primary" href="/spawn">
            Spawn a New Server
          </NavButton>
        </header>
        <ServersList />
      </div>
    </Container>
  );
}

export default ServersView;
