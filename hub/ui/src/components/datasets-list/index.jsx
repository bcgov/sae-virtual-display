import React from 'react';
import { uid } from 'react-uid';

import Card from './card';
import Search from './search';
import { Container } from './styles';

function DatasetsList({ data = [], onFilter, starred }) {
  return (
    <Container>
      <Search onFilter={onFilter} />
      {data &&
        data.map(d => (
          <Card key={uid(d.id)} data={d} starred={starred.includes(d.id)} />
        ))}
    </Container>
  );
}

export default DatasetsList;
