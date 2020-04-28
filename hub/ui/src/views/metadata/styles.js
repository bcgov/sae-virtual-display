import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  overflow: hidden;
  background: ${colors.background};
`;

export const Content = styled.div`
  flex: 1;
  justify-content: center;
  overflow-y: auto;
`;

export const ContentContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;
