import React, { forwardRef, useContext, useEffect } from 'react';
import Button from '@atlaskit/button';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

import { buttonTheme, Brand, Container, Nav } from './styles';

const ThemedButton = forwardRef(({ href = '', children, ...rest }, ref) => (
  <NavLink {...rest} to={href} innerRef={ref}>
    {children}
  </NavLink>
));

function NavButton({ children, href, ...rest }) {
  const { pathname } = useLocation();
  return (
    <Button
      isSelected={
        !!matchPath(pathname, {
          path: href,
          exact: rest.exact,
        })
      }
      component={ThemedButton}
      href={href}
      theme={buttonTheme}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default NavButton;
