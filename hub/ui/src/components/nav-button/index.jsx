import React, { forwardRef } from 'react';
import Button from '@atlaskit/button';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

import { buttonTheme } from './styles';

const ThemedButton = forwardRef(({ href = '', children, ...rest }, ref) => (
  <NavLink {...rest} to={href} innerRef={ref}>
    {children}
  </NavLink>
));

function NavButton({ children, href, ...rest }) {
  const { pathname } = useLocation();
  const isSelected = !!matchPath(pathname, {
    path: href,
    exact: rest.exact,
  });

  return (
    <Button
      isSelected={isSelected}
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
