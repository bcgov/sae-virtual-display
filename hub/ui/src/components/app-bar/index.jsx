import React, { useContext } from 'react';
import Button from '@atlaskit/button';
import WorkbenchIcon from '@atlaskit/icon/glyph/dashboard';

import NavButton from './nav-button';
import { Brand, Container, Icon, Nav, SignedInText } from './styles';
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
        {props.isHelpEnabled && (
          <Button
            appearance="primary"
            id="Workbench-tour-btn"
            onClick={props.onStartTour}
          >
            Take Tour
          </Button>
        )}
        <SignedInText>Signed in as {user}</SignedInText>
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
