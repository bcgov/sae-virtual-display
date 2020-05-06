import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

const NavLinkWrapper = ({ className, children, to }) => (
  <NavLink to={to} className={className}>
    {children}
  </NavLink>
);

export const Container = styled.nav`
  width: 400px;
  overflow-y: ${props => (props.loading ? 'hidden' : 'auto')};
  position: relative;
  border-right: 2px solid ${colors.backgroundHover};
  background: ${colors.background};
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 1rem;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid ${colors.backgroundHover};
`;

export const SearchField = styled.div`
  flex: 1;
  margin-right: 10px;
`;

export const CardContainer = styled(NavLinkWrapper)`
  display: flex;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.backgroundHover};
  cursor: pointer;
  color: ${colors.text};

  & button {
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

    & button {
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
