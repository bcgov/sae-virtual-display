import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import WatchIcon from '@atlaskit/icon/glyph/watch';
import WatchFilledIcon from '@atlaskit/icon/glyph/watch-filled';

import { Container } from './styles';

function Filters({ hideIdle, onSearch, onToggle }) {
  return (
    <Container>
      <div>
        <Textfield
          type="search"
          placeholder="Filter"
          onChange={event => onSearch(event.target.value)}
          width="medium"
        />
      </div>
      <ButtonGroup>
        <Button
          iconBefore={hideIdle ? <WatchFilledIcon /> : <WatchIcon />}
          onClick={onToggle}
        >
          {hideIdle ? 'Show All' : 'Hide Unbuilt Containers'}
        </Button>
      </ButtonGroup>
    </Container>
  );
}

export default Filters;
