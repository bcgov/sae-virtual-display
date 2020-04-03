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
      <SpotlightTarget name="filter-apps">
        <Textfield
          type="search"
          placeholder="Filter"
          onChange={event => onSearch(event.target.value)}
          width="medium"
        />
      </SpotlightTarget>
      {status === 'loading' && <Spinner />}
      <SpotlightTarget name="toggle-apps">
        <ButtonGroup>
          <Button
            iconBefore={hideIdle ? <WatchIcon /> : <WatchFilledIcon />}
            onClick={onToggle}
          >
            {hideIdle ? 'Show All Apps' : 'Show Running Apps Only'}
          </Button>
        </ButtonGroup>
      </SpotlightTarget>
    </Container>
  );
}

export default Filters;
