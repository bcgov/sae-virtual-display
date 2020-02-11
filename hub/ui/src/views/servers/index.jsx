import React, { useContext, useReducer } from 'react';
import AppCard from '@src/components/app-card';
import Loading from '@src/components/app-card/loading';
import get from 'lodash/get';
import ServersFilters from '@src/components/servers-filters';
// import ServersList from '@src/components/servers-list';
import merge from 'lodash/merge';
import useApi from '@src/hooks/useApi';
import WorkbenchContext from '@src/utils/context';
import { uid } from 'react-uid';

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
  const items = apps
    .map(d => {
      const servers = get(data, 'servers', []);
      const server = servers.find(s => s.name === d.name) || {};
      return merge(
        {
          lastActivity: '',
          pending: '',
          progressUrl: '',
          started: '',
          state: {},
          ready: false,
          url: '',
        },
        d,
        server,
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
        {loading && <AppCard total={5} />}
        <div>
          {items.map((d, index) => (
            <AppCard alt key={uid(d)} data={d} />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default ServersView;
