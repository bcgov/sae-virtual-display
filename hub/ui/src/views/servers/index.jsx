import React, { useContext } from 'react';
import AppCard from '@src/components/app-card';
import get from 'lodash/get';
import ServersFilters from '@src/components/servers-filters';
// import ServersList from '@src/components/servers-list';
import merge from 'lodash/merge';
import useApi from '@src/hooks/useApi';
import WorkbenchContext from '@src/utils/context';

import { Container } from './styles';

function ServersView() {
  const { apps, user } = useContext(WorkbenchContext);
  const [data, loading] = useApi(`users/${user}`);
  const items = apps.map(d => {
    const servers = get(data, 'servers', []);
    const server = servers.find(s => s.name === d.name) || {};
    return merge(
      {
        lastActivity: new Date().toISOString(),
        pending: '',
        progressUrl: '',
        started: new Date().toISOString(),
        state: {},
        url: '',
      },
      d,
      server,
    );
  });

  return (
    <Container>
      <ServersFilters />
      <div>
        {items.map((d, index) => (
          <AppCard alt key={index} data={d} />
        ))}
      </div>
    </Container>
  );
}

export default ServersView;
