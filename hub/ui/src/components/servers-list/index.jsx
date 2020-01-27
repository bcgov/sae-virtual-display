import React from 'react';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseIso from 'date-fns/parseIso';

import CoreImage from '../core/image';

import { NameCell } from './styles';
import { emptyView, head } from './utils';

function ServersList({ apps, data = [], loading }) {
  return (
    <DynamicTable
      emptyView={emptyView}
      head={head}
      isLoading={loading}
      rows={data.map(d => ({
        key: d.pid,
        cells: [
          {
            key: 'name',
            content: (
              <NameCell>
                <CoreImage src="/images/rstudio-logo.png" width={20} /> {d.name}
              </NameCell>
            ),
          },
          {
            key: 'lastActivity',
            content: formatDistanceToNow(parseIso(d.lastActivity)),
          },
          {
            key: 'url',
            content: (
              <Button appearance="primary" disabled={!d.ready}>
                {!d.pending ? 'Launch' : 'Stop'}
              </Button>
            ),
          },
        ],
      }))}
    />
  );
}

export default ServersList;
