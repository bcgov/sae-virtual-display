import React from 'react';
import { uid } from 'react-uid';

import Card from './card';
import Search from './search';
import { Container } from './styles';

function DatasetsList({
  data = [],
  onClearSector,
  onFilter,
  onSort,
  sector,
  starred,
  sortBy,
}) {
  return (
    <Container>
      <Search
        onClearSector={onClearSector}
        onFilter={onFilter}
        onSort={onSort}
        sector={sector}
        sortBy={sortBy}
      />
      {data &&
        data.map(d => (
          <Card key={uid(d.id)} data={d} starred={starred.includes(d.id)} />
        ))}
    </Container>
  );
}

export default DatasetsList;
