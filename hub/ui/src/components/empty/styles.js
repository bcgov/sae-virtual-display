import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Container = styled.div`
  margin: 60px 0;
  overflow: hidden;
  text-align: center;
`;

export const Text = styled.p`
  color: ${colors.subtleText};
`;

export const MetadataContainer = styled.div`
  height: calc(100vh - 50px);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
