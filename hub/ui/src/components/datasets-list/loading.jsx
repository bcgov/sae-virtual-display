import React from 'react';
import Loading from '@src/components/core/loading';

import { Container } from './styles';

function DatasetsLoading({ data = [], error, status }) {
  return (
    <Container>
      <Loading />
    </Container>
  );
}

export default DatasetsLoading;
