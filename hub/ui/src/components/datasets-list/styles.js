import Button from '@atlaskit/button';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Container = styled.nav`
  width: 400px;
  overflow-y: auto;
  border-right: 2px solid ${colors.backgroundHover};
  background: ${colors.background};
`;

export const StarredButton = styled(Button)`
  margin-top: 5px;

  &:hover {
    background-color: transparent;
  }
`;

export const CardContainer = styled(NavLink)`
  display: flex;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.backgroundHover};
  cursor: pointer;
  color: ${colors.text};

  & ${StarredButton} {
    opacity: ${props => (props.starred ? 1 : 0)};
  }

  &,
  &:focus {
    outline: none;
  }

  &.active,
  &:hover {
    text-decoration: none;
    color: ${colors.text};
    background: ${colors.backgroundHover};

    & ${StarredButton} {
      opacity: 1;
    }
  }
`;

export const CardIcon = styled.div`
  width: 40px;
  margin: 10px 0 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CardContent = styled.div`
  flex: 1;
  margin: 10px;

  p {
    font-size: 12px;
  }
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardFooter = styled.footer`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${colors.subtleText};
  font-size: 12px;

  & div {
    display: flex;
    align-items: center;
  }
`;
