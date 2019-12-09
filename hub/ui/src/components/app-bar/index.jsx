import React, { forwardRef, useContext, useEffect } from 'react';
import Button from '@atlaskit/button';
import { NavLink } from 'react-router-dom';
import WorkbenchIcon from '@atlaskit/icon/glyph/dashboard';

import NavButton from './nav-button';
import { Brand, Container, Icon, Nav } from './styles';
import WorkbenchContext from '../../utils/context';

function AppBar(props) {
  const { user } = useContext(WorkbenchContext);

  return (
    <Container>
      <div>
        <Brand to="/">
          <Icon>
            <WorkbenchIcon primaryColor="#FFAB00" />
          </Icon>
          SAE Virtual Display
        </Brand>
        <Nav>
          <NavButton exact href="/">
            Home
          </NavButton>
        </Nav>
      </div>
      <div>
        <p className="navbar-text">Signed in as {user}</p>
        <Button
          appearance="primary"
          id="Workbench-logout-btn"
          href="/hub/logout"
        >
          Logout
        </Button>
      </div>
    </Container>
  );
}

export default AppBar;
