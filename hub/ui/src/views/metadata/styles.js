import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  overflow: hidden;
  background: ${colors.background};
`;

export const List = styled.nav`
  width: 400px;
  overflow-y: auto;
  border-right: 2px solid ${colors.backgroundHover};
  background: ${colors.background};
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const CardContainer = styled(NavLink)`
  display: flex;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.backgroundHover};
  cursor: pointer;

  &,
  &:focus {
    outline: none;
  }

  &.active,
  &:hover {
    text-decoration: none;
    background: ${colors.backgroundHover};
  }
`;

export const CardIcon = styled.div`
  width: 30px;
  margin: 10px 0 10px 10px;
  display: flex;
  justify-content: center;
`;

export const CardContent = styled.div`
  flex: 1;
  margin: 10px;
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
`;
