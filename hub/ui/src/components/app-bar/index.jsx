import React, { forwardRef, useContext, useEffect } from 'react';
import Button from '@atlaskit/button';
import { NavLink } from 'react-router-dom';
import WorkbenchIcon from '@atlaskit/icon/glyph/department';

import NavButton from './nav-button';
import { Brand, Container, Nav } from './styles';
import WorkbenchContext from '../../utils/context';

function AppBar(props) {
  const config = useContext(WorkbenchContext);
  const [user, setUser] = React.useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/hub/api/users/${config.user}`);

      if (res.ok) {
        const payload = await res.json();
        setUser(payload);
      }
    }
    fetchData();
  }, []);

  return (
    <Container>
      <div>
        <Brand to="/">
          <WorkbenchIcon primaryColor="yellow" />
          Workbench
        </Brand>
        <Nav>
          <NavButton exact href="/">
            Home
          </NavButton>
          <NavButton href="/metadata">Metadata</NavButton>
        </Nav>
      </div>
      <div>
        <p className="navbar-text">Signed in as {user.name || 'loading..'}</p>
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
