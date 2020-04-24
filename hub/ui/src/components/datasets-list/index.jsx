import React from 'react';

import Card from './card';
import { Container } from './styles';

function DatasetsList({ data = [] }) {
  return (
    <Container>{data && data.map(d => <Card key={d.id} data={d} />)}</Container>
  );
}

export default DatasetsList;
