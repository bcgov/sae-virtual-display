import React, { useContext, useReducer } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import ServersFilters from '@src/components/servers-filters';
import sortBy from 'lodash/sortBy';
import useApi from '@src/hooks/use-api';
import WorkbenchContext from '@src/utils/context';
import { uid } from 'react-uid';

import Application from '../application';
import { Container } from './styles';

const defaultState = {
  hideIdle: false,
  search: '',
  sort: 'name',
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

    case 'sort':
      return {
        ...state,
        sort: action.payload,
      };

    default:
      throw new Error();
  }
};

function ServersView() {
  const { apps } = useContext(WorkbenchContext);
  const { status, data, refresh } = useApi('users/{user}');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const regex = new RegExp(state.search, 'i');
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
    .filter(d => (state.search.trim() ? d.label.search(regex) >= 0 : true))
    .filter(d => (state.hideIdle ? d.ready : true));
  const sorted = sortBy(items, state.sort);

  return (
    <Container>
      <div>
        <ServersFilters
          hideIdle={state.hideIdle}
          onFilter={() => dispatch({ type: 'toggle' })}
          onSearch={value => dispatch({ type: 'search', payload: value })}
          onSort={value => dispatch({ type: 'sort', payload: value })}
          status={status}
        />
        <div>
          {sorted.map((d, index) => (
            <Application
              key={uid(d)}
              hasHelp={index === 0}
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
