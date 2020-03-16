import React, { useContext } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import WorkbenchIcon from '@atlaskit/icon/glyph/dashboard';
import Help from '@src/views/help';

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
        <ButtonGroup>
          <Button
            appearance="primary"
            id="Workbench-logout-btn"
            href="/hub/logout"
          >
            Logout
          </Button>
          <Help />
        </ButtonGroup>
      </div>
    </Container>
  );
}

export default AppBar;
