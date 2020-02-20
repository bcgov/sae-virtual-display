import React, { useContext, useReducer, useState } from 'react';
import AppCardLoading from '@src/components/app-card/loading';
import get from 'lodash/get';
import merge from 'lodash/merge';
import ServersFilters from '@src/components/servers-filters';
import useApi from '@src/hooks/useApi';
import WorkbenchContext from '@src/utils/context';
import { uid } from 'react-uid';

import Application from '../application';
import { Container } from './styles';

const defaultState = {
  hideIdle: false,
  search: '',
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'toggle':
      return {
        ...state,
        hideIdle: !state.hideIdle,
      };

    case 'search':
      return {
        ...state,
        search: action.payload,
      };

    default:
      return new Error('unhandled');
  }
};

function ServersView() {
  const { apps, user } = useContext(WorkbenchContext);
  const [data, loading] = useApi(`users/${user}`);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [spawnedContainers, setSpawnedContainers] = useState([]);
  const items = apps
    .map(d => {
      const server = get(data, `servers.${d.name}`, {});
      return merge(
        {
          lastActivity: new Date().toISOString(),
          pending: '',
          progressUrl: '',
          started: new Date().toISOString(),
          state: {},
          ready: false,
          url: '',
        },
        d,
        server,
        {
          ready: server.ready || spawnedContainers.includes(d.name),
        },
      );
    })
    .sort(d => !d.ready)
    .filter(d => {
      if (state.search.trim()) {
        return d.label.search(state.search) >= 0;
      }
      return true;
    })
    .filter(d => {
      if (state.hideIdle) {
        return d.ready;
      }

      return true;
    });

  return (
    <Container>
      <div>
        <ServersFilters
          hideIdle={state.hideIdle}
          onSearch={value => dispatch({ type: 'search', payload: value })}
          onToggle={() => dispatch({ type: 'toggle' })}
        />
        {loading && <AppCardLoading total={5} />}
        <div>
          {items.map((d, index) => (
            <Application
              key={uid(d)}
              data={d}
              onClick={() => alert('open app in new tab')}
              onSpawned={app =>
                setSpawnedContainers(state => [...state, app.name])
              }
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default ServersView;
