import React, { useState } from 'react';
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

function AppBar({ isHelpEnabled, onStartTour, user }) {
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
            Virtual Display Hub
          </Brand>
          <Nav>
            <NavButton exact href="/">
              Home
            </NavButton>
          </Nav>
        </div>
        <div>
          {isHelpEnabled && (
            <Button
              appearance="primary"
              iconBefore={<FeedbackIcon />}
              id="Workbench-tour-btn"
              onClick={onStartTour}
              testId="start-tour-btn"
            >
              Take The Quickstart Tour
            </Button>
          )}
          <MainMenu>
            <DropdownMenu
              position="bottom right"
              trigger={
                <MainMenuButton data-testid="trigger">
                  <SettingsIcon size="large" />
                </MainMenuButton>
              }
              testId="app-bar-menu"
            >
              <DropdownItemGroup>
                <DropdownItem data-testid="username">
                  Signed in as {user}
                </DropdownItem>
                <DropdownItem data-testid="help-button" onClick={onHelpToggle}>
                  Help
                </DropdownItem>
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
