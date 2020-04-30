import React from 'react';
import times from 'lodash/times';
import { uid } from 'react-uid';

import { Container } from './styles';
import { LoadingBar, LoadingContainer } from '../core/loading/styles';

function DatasetsLoading() {
  const elements = [];

  times(20, n =>
    elements.push(
      <LoadingContainer key={uid(n)}>
        <LoadingBar width="45%" />
        <LoadingBar />
        <LoadingBar />
      </LoadingContainer>,
    ),
  );

  return <Container loading>{elements}</Container>;
}

export default DatasetsLoading;
