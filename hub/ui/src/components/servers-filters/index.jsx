import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { SpotlightTarget } from '@atlaskit/onboarding';
import Textfield from '@atlaskit/textfield';
import WatchIcon from '@atlaskit/icon/glyph/watch';
import WatchFilledIcon from '@atlaskit/icon/glyph/watch-filled';

import { Container } from './styles';

function Filters({ hideIdle, onSearch, onToggle, status }) {
  return (
    <Container>
      <SpotlightTarget name="help-2">
        <div style={{ position: 'relative' }}>
          <Textfield
            type="search"
            placeholder="Filter"
            onChange={event => onSearch(event.target.value)}
            width="medium"
          />
        </div>
      </SpotlightTarget>
      {status === 'loading' && <Spinner />}
      <SpotlightTarget name="help-3">
        <div style={{ position: 'relative' }}>
          <ButtonGroup>
            <Button
              iconBefore={hideIdle ? <WatchIcon /> : <WatchFilledIcon />}
              onClick={onToggle}
            >
              {hideIdle ? 'Show All Apps' : 'Show Running Apps Only'}
            </Button>
          </ButtonGroup>
        </div>
      </SpotlightTarget>
    </Container>
  );
}

export default Filters;
