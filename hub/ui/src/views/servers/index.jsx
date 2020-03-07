import React, { useContext, useReducer } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import ServersFilters from '@src/components/servers-filters';
import useApi from '@src/hooks/use-api';
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
      throw new Error();
  }
};

function ServersView() {
  const { apps } = useContext(WorkbenchContext);
  const { status, data, refresh } = useApi('users/{user}');
  const [state, dispatch] = useReducer(reducer, defaultState);
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
      );
    })
    .sort(d => !d.ready)
    .filter(d =>
      state.search.trim() ? d.label.search(state.search) >= 0 : true,
    )
    .filter(d => (state.hideIdle ? d.ready : true));

  return (
    <Container>
      <div>
        <ServersFilters
          hideIdle={state.hideIdle}
          onSearch={value => dispatch({ type: 'search', payload: value })}
          onToggle={() => dispatch({ type: 'toggle' })}
          status={status}
        />
        <div>
          {items.map((d, index) => (
            <Application
              key={uid(d)}
              data={d}
              onClick={() => alert('open app in new tab')}
              onSpawnComplete={refresh}
              onShutdownComplete={refresh}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default ServersView;
