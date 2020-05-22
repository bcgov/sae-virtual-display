import styled from 'styled-components';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';

export const Container = styled.nav`
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  background: ${colors.linkActive};

  & li {
    margin: 10px 0;
  }
`;

export const NavBarButton = styled(Button)`
  background: ${props => !props.isSelected && colors.linkActive} !important;
`;
