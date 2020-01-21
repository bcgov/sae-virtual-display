import styled from 'styled-components';
import { colors, borderRadius, typography } from '@atlaskit/theme';

export const Container = styled.div`
  margin: 20px;
  text-align: center;
`;

export const Track = styled.div`
  height: 1rem;
  display: flex;
  overflow: hidden;
  background-color: ${colors.backgroundHover};
  border-radius: ${borderRadius}px;
`;

export const Bar = styled.div`
  background-color: ${colors.primary};
  transition: width 0.6s ease;
`;

export const HeaderText = styled.p`
  ${typography.h200()}
  margin-bottom: 20px;
`;

export const ProgressText = styled.p`
  ${typography.h100()}
  font-weight: 500;
`;
