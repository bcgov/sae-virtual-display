import React from 'react';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

function Loading() {
  return (
    <Container>
      <Spinner size="large" />
    </Container>
  );
}

export default Loading;
