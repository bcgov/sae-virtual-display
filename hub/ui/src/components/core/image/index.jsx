import React from 'react';
import styled from 'styled-components';

function CoreImage({ alt, fluid, ...props }) {
  return <img alt={alt} {...props} />;
}

CoreImage.defaultProps = {
  alt: '',
};

export default styled(CoreImage)`
  max-width: ${props => props.fluid && '100%'};
  height: auto;
`;
