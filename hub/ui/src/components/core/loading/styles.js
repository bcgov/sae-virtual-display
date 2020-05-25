import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

export const LoadingContainer = styled.div`
  margin: 30px 20px;

  ${props => props.flex && 'display: flex;'}
`;

export const LoadingBar = styled.div`
  width: ${props => props.width || '100%'};
  height: 20px;
  margin: 0 0 0.5rem;
  background-color: ${colors.backgroundHover};
  border-radius: ${borderRadius}px;
`;

export const LoadingSpacer = styled.div`
  width: 100%;
  height: ${props => props.height || '40px'};
  clear: both;
`;

export const LoadingSquare = styled.div`
  width: 200px;
  height: 200px;
  margin: 20px;
  background-color: ${colors.backgroundHover};
  border-radius: ${borderRadius}px;
`;
