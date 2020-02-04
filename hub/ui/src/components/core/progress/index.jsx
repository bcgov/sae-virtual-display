import * as React from 'react';

import { Bar, Container, HeaderText, ProgressText, Track } from './styles';

function Progress({ message = 'Pending', value = 0 }) {
  const valueNow = Math.max(value / 100, 0);
  const width = `${Math.max(value, 0)}%`;

  return (
    <Container>
      <HeaderText>Your server is starting up.</HeaderText>
      <Track>
        <Bar
          role="progressbar"
          aria-valuenow={valueNow}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width }}
        />
      </Track>
      {message && <ProgressText>{message}</ProgressText>}
    </Container>
  );
}

export default Progress;
