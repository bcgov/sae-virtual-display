import React, { useContext, useState } from 'react';
import Button from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import WorkbenchIcon from '@atlaskit/icon/glyph/dashboard';
import Help from '@src/views/help';

import NavButton from './nav-button';
import {
  Brand,
  Container,
  Icon,
  MainMenu,
  MainMenuButton,
  Nav,
} from './styles';
import WorkbenchContext from '../../utils/context';

function AppBar(props) {
  const { user } = useContext(WorkbenchContext);
  const [open, toggleOpen] = useState(false);

  function onHelpToggle() {
    toggleOpen(state => !state);
  }

  return (
    <>
      <Help open={open} onClose={onHelpToggle} />
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
              iconBefore={<FeedbackIcon />}
              id="Workbench-tour-btn"
              onClick={props.onStartTour}
            >
              Take The Quickstart Tour
            </Button>
          )}
          <MainMenu>
            <DropdownMenu
              position="bottom right"
              trigger={
                <MainMenuButton>
                  <SettingsIcon size="large" />
                </MainMenuButton>
              }
            >
              <DropdownItemGroup>
                <DropdownItem>Signed in as {user}</DropdownItem>
                <DropdownItem onClick={onHelpToggle}>Help</DropdownItem>
                <DropdownItem href="/hub/logout">Logout</DropdownItem>
              </DropdownItemGroup>
            </DropdownMenu>
          </MainMenu>
        </div>
      </Container>
    </>
  );
}

export default AppBar;
