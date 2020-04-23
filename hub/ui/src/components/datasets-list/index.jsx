import React from 'react';
import Loading from '@src/components/core/loading';

import Card from './card';
import { Container, ErrorMessage } from './styles';

function DatasetsList({ data = [], error, status }) {
  return (
    <Container>
      {status === 'error' && <ErrorMessage>{error}</ErrorMessage>}
      {status === 'loading' && <Loading />}
      {data && data.map(d => <Card key={d.id} data={d} />)}
    </Container>
  );
}

export default DatasetsList;
