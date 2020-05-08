import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Container = styled.nav`
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  background: ${colors.linkActive};

  & a,
  & button {
    margin: 10px 0;
  }
`;
