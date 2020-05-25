import React from 'react';

import {
  LoadingBar,
  LoadingContainer,
  LoadingSpacer,
  LoadingSquare,
} from '../core/loading/styles';

function DatasetLoading() {
  return (
    <div>
      <LoadingContainer>
        <LoadingBar width="25%" />
        <LoadingBar width="75%" />
        <LoadingBar width="75%" />
        <LoadingBar width="75%" />
        <LoadingBar width="75%" />
        <LoadingSpacer />
        <LoadingBar />
        <LoadingBar />
        <LoadingBar width="50%" />
        <LoadingContainer flex>
          <LoadingSquare />
          <LoadingSquare />
          <LoadingSquare />
        </LoadingContainer>
        <LoadingBar width="25%" />
        <LoadingBar width="75%" />
        <LoadingBar width="75%" />
      </LoadingContainer>
    </div>
  );
}

export default DatasetLoading;
