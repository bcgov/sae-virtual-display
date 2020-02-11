import styled from 'styled-components';
import { colors, borderRadius, typography } from '@atlaskit/theme';

export const Container = styled.div`
  text-align: left;
`;

export const Track = styled.div`
  height: 1rem;
  display: flex;
  overflow: hidden;
  background-color: ${colors.backgroundHover};
  border-radius: ${borderRadius}px;
`;

export const ProgressContainer = styled.div`
  margin: 15px 0 0;
`;

export const HeaderText = styled.p`
  ${typography.h400()}
  margin-bottom: 0;
`;

export const ProgressText = styled.p`
  display: flex;
  justify-content: space-between;
  ${typography.h100()}
  font-weight: 500;
  margin-top: 0.5rem;
`;
