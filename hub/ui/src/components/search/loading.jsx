import React from 'react';
import times from 'lodash/times';
import { uid } from 'react-uid';

import { LoadingBar, LoadingContainer, ResourcesList } from './styles';

function Loading({ total = 3 }) {
  const elements = [];
  times(total, n =>
    elements.push(
      <LoadingContainer key={uid(n)}>
        <LoadingBar width="25%" />
        <LoadingBar />
        <LoadingBar width="40%" />
        <LoadingBar width={100} />
        <LoadingBar width={100} />
        <LoadingBar width={100} />
      </LoadingContainer>,
    ),
  );

  return <div style={{ marginTop: 20 }}>{elements}</div>;
}

export default Loading;
