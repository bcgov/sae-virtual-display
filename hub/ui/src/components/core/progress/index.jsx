import * as React from 'react';
import { SuccessProgressBar } from '@atlaskit/progress-bar';

import {
  Container,
  HeaderText,
  ProgressText,
  ProgressContainer,
} from './styles';

function Progress({
  headerText = 'Request in progress',
  successText = 'Request complete',
  message = 'Processing...',
  value = 0,
}) {
  const adjustedValue = value / 100;
  const isComplete = adjustedValue >= 1;
  const isPending = value === 0;
  const percentageText = value.toString();

  return (
    <Container>
      <HeaderText>{isComplete ? successText : headerText}</HeaderText>
      <ProgressContainer>
        <SuccessProgressBar isIndeterminate={isPending} value={adjustedValue} />
      </ProgressContainer>
      <ProgressText>
        <span>{message}</span>
        <span>{`${percentageText}% complete`}</span>
      </ProgressText>
    </Container>
  );
}

export default Progress;
