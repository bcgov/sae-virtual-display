import React from 'react';
import Button from '@atlaskit/button';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import DynamicTable from '@atlaskit/dynamic-table';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Link } from 'react-router-dom';
import parseIso from 'date-fns/parseIso';

import CoreImage from '../core/image';

import { NameCell } from './styles';
import { emptyView, head } from './utils';

function ServersList({ apps, data = [], history, loading }) {
  return (
    <DynamicTable
      emptyView={emptyView}
      head={head}
      isLoading={loading}
      rows={apps.map(d => ({
        key: d.pid,
        cells: [
          {
            key: 'label',
            content: (
              <NameCell>
                <CoreImage src={d.image} width={20} /> {d.label}
              </NameCell>
            ),
          },
          /* { */
          /*   key: 'lastActivity', */
          /*   content: formatDistanceToNow(parseIso(d.lastActivity)), */
          /* }, */
          {
            key: 'url',
            content: (
              <Dropdown trigger={<Button appearance="primary">Launch</Button>}>
                <DropdownItem
                  href="/spawn"
                  linkComponent={props => <Link {...props} to={props.href} />}
                >
                  v1.0
                </DropdownItem>
              </Dropdown>
            ),
          },
        ],
      }))}
    />
  );
}

export default ServersList;
