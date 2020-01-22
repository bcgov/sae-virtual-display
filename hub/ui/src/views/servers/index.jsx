import React, { useContext } from 'react';
import get from 'lodash/get';
import NavButton from '@src/components/nav-button';
import ServersList from '@src/components/servers-list';
import useApi from '@src/hooks/useApi';
import WorkbenchContext from '@src/utils/context';

import { Container } from './styles';

function ServersView() {
  const { apps, user } = useContext(WorkbenchContext);
  const [data, loading] = useApi(`users/${user}`);

  return (
    <Container>
      <div>
        <header>
          <NavButton appearance="primary" href="/spawn">
            Spawn a New Server
          </NavButton>
        </header>
        <ServersList
          apps={apps}
          loading={loading}
          data={get(data, 'servers', [])}
        />
      </div>
    </Container>
  );
}

export default ServersView;
