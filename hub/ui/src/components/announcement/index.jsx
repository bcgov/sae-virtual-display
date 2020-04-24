import * as React from 'react';
import SectionMessage from '@atlaskit/section-message';

import { Container } from './styles';

function Annoucement({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Container>
      <SectionMessage appearance="warning">{message}</SectionMessage>
    </Container>
  );
}

export default Annoucement;
