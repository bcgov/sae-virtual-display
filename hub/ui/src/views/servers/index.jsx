import React, { useContext, useReducer } from 'react';
import Empty from '@src/components/empty';
import ServersFilters from '@src/components/servers-filters';
import useApi from '@src/hooks/use-api';
import WorkbenchContext from '@src/utils/context';
import { uid } from 'react-uid';

import Application from '../application';
import { Container } from './styles';
import { processData } from './utils';
import { defaultState, reducer } from './reducer';

function ServersView() {
  const { apps } = useContext(WorkbenchContext);
  const { status, data, refresh } = useApi('users/{user}');
  const [state, dispatch] = useReducer(reducer, defaultState);
  const listItems = processData(state, apps, data);

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
          {listItems.length === 0 && <Empty status={status} />}
          {listItems.map((d, index) => (
            <Application
              key={uid(d)}
              hasHelp={index === 0}
              data={d}
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
