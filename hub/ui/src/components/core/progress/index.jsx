import * as React from 'react';

import { Bar, Container, ProgressText, Track } from './styles';

function Progress({ value }) {
  return (
    <Container>
      <Track>
        <Bar
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: `${value * 100}%` }}
        />
      </Track>
      <ProgressText>Testing 1323</ProgressText>
    </Container>
  );
}

export default Progress;
