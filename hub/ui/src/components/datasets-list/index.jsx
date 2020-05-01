import React from 'react';
import { uid } from 'react-uid';

import Card from './card';
import { Container } from './styles';

function DatasetsList({ data = [], starred }) {
  return (
    <Container>
      {data &&
        data.map(d => (
          <Card key={uid(d.id)} data={d} starred={starred.includes(d.id)} />
        ))}
    </Container>
  );
}

export default DatasetsList;
