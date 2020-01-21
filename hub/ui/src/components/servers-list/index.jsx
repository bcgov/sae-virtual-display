import React from 'react';
import DynamicTable from '@atlaskit/dynamic-table';

import { emptyView, head } from './utils';

function ServersList({ data = [] }) {
  return (
    <DynamicTable emptyView={emptyView} head={head} rows={{ cells: data }} />
  );
}

export default ServersList;
