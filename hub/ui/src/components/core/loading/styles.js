import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

export const LoadingContainer = styled.div`
  margin: 30px 20px;
`;

export const LoadingBar = styled.div`
  width: ${props => props.width || '100%'};
  height: 20px;
  margin: 0 0 0.5rem;
  background-color: ${colors.backgroundHover};
  border-radius: ${borderRadius}px;
`;
