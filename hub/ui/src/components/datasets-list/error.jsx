import React from 'react';

import { Container, ErrorMessage } from './styles';

function DatasetsError({ error }) {
  return (
    <Container>
      <ErrorMessage>{error}</ErrorMessage>
    </Container>
  );
}

export default DatasetsError;
