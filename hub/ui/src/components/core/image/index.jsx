import React from 'react';
import styled from 'styled-components';

function CoreImage({ fluid, ...props }) {
  return <img {...props} />;
}

export default styled(CoreImage)`
  max-width: ${props => props.fluid && '100%'};
  height: auto;
`;
