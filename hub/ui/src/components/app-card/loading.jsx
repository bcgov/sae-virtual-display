import React from 'react';
import times from 'lodash/times';
import { uid } from 'react-uid';

import { LoadingCard } from './styles';

function AppCardLoading({ total = 1 }) {
  const elements = [];

  times(total, n =>
    elements.push(
      <LoadingCard key={uid(n)} data-testid="app-card-loading">
        <div />
        <div>
          <div />
          <div />
          <div />
        </div>
      </LoadingCard>,
    ),
  );

  return elements;
}

export default AppCardLoading;
